import { z } from 'zod';
import { getServerClient } from '@/lib/supabase/server';
import { getOrCreateConversation, saveMessage } from '@/lib/db';
import { detectDialect } from '@/lib/arabic/dialect-detector';
import { resolveDialect, writerSystemPrompt } from '@/lib/ai/prompts';
import { WRITER_MODEL, estimateCostUsd, streamClaude } from '@/lib/ai/claude';
import { checkAndIncrementRateLimit } from '@/lib/rate-limit';
import {
  MAX_FILES,
  attachmentsSummary,
  buildUserContent,
  isSupportedAttachment,
  processAttachment,
} from '@/lib/ai/attachments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  conversationId: z.string().uuid().nullable().optional(),
  message: z.string().max(8000),
});

export async function POST(req: Request) {
  const supabase = getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'يجب تسجيل الدخول.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const rate = await checkAndIncrementRateLimit(supabase, user.id, 'WRITER');
  if (!rate.allowed) {
    return new Response(
      JSON.stringify({
        error: `لقد بلغت حدّ الكاتب اليومي (${rate.limit} رسالة). جرّب مجدداً بعد ${new Date(rate.resetAt).toLocaleString('ar-EG')}`,
      }),
      { status: 429, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Parse message + files (FormData). Falls back to JSON for backwards compat.
  let message = '';
  let conversationId: string | null = null;
  const rawFiles: File[] = [];

  const contentType = req.headers.get('content-type') ?? '';
  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    message = String(form.get('message') ?? '').trim();
    const convRaw = form.get('conversationId');
    if (typeof convRaw === 'string' && convRaw) conversationId = convRaw;
    for (const entry of form.getAll('files')) {
      if (entry instanceof File && entry.size > 0) rawFiles.push(entry);
    }
  } else {
    try {
      const body = (await req.json()) as { message?: string; conversationId?: string | null };
      message = String(body.message ?? '').trim();
      conversationId = body.conversationId ?? null;
    } catch {
      return new Response(JSON.stringify({ error: 'طلب غير صالح.' }), { status: 400 });
    }
  }

  const parsed = schema.safeParse({ message, conversationId });
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'رسالتك طويلة جداً.' }), { status: 400 });
  }

  if (!message && rawFiles.length === 0) {
    return new Response(JSON.stringify({ error: 'اكتب رسالة أو أرفق ملفاً.' }), { status: 400 });
  }

  if (rawFiles.length > MAX_FILES) {
    return new Response(
      JSON.stringify({ error: `الحد الأقصى ${MAX_FILES} ملفات في الرسالة الواحدة.` }),
      { status: 400 },
    );
  }

  // Validate file types before any expensive work
  for (const f of rawFiles) {
    if (!isSupportedAttachment(f)) {
      return new Response(
        JSON.stringify({ error: `نوع الملف «${f.name}» غير مدعوم.` }),
        { status: 400 },
      );
    }
  }

  // Profile for personalization
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const detected = detectDialect(message || '');
  const dialect = resolveDialect(profile, detected);

  const conversation = await getOrCreateConversation(supabase, {
    userId: user.id,
    mode: 'WRITER',
    conversationId,
    firstUserMessage: message || `[${rawFiles.length} مرفق]`,
    dialectUsed: dialect,
  });

  if (conversation.dialect_used !== dialect) {
    await supabase
      .from('conversations')
      .update({ dialect_used: dialect })
      .eq('id', conversation.id);
  }

  const { data: history } = await supabase
    .from('messages')
    .select('role, content')
    .eq('conversation_id', conversation.id)
    .order('created_at', { ascending: true });

  const historyMessages = (history ?? []).filter(
    (m): m is { role: 'user' | 'assistant'; content: string } =>
      m.role === 'user' || m.role === 'assistant',
  );

  // Process attachments (base64 images/PDFs, DOCX → extracted text)
  let attachments;
  try {
    attachments = await Promise.all(rawFiles.map(processAttachment));
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'تعذّر قراءة المرفقات.' }),
      { status: 400 },
    );
  }

  const userContent = buildUserContent(message, attachments);
  const savedUserText = (message + attachmentsSummary(rawFiles.map((f) => f.name))).trim();

  await saveMessage(supabase, {
    conversationId: conversation.id,
    role: 'user',
    content: savedUserText || '[مرفقات]',
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(
          encoder.encode(
            `event: meta\ndata: ${JSON.stringify({ conversationId: conversation.id, dialect })}\n\n`,
          ),
        );

        const result = await streamClaude({
          model: WRITER_MODEL,
          system: writerSystemPrompt(dialect, profile),
          messages: [...historyMessages, { role: 'user', content: userContent }],
          maxTokens: 4096,
          temperature: 0.7,
          onToken: (delta) => {
            controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify(delta)}\n\n`));
          },
        });

        await saveMessage(supabase, {
          conversationId: conversation.id,
          role: 'assistant',
          content: result.fullText,
          modelUsed: WRITER_MODEL,
          tokensInput: result.inputTokens,
          tokensOutput: result.outputTokens,
          costUsd: estimateCostUsd(result.inputTokens, result.outputTokens, WRITER_MODEL),
          latencyMs: result.latencyMs,
        });

        controller.enqueue(
          encoder.encode(
            `event: done\ndata: ${JSON.stringify({
              tokensInput: result.inputTokens,
              tokensOutput: result.outputTokens,
              latencyMs: result.latencyMs,
              remaining: rate.remaining,
            })}\n\n`,
          ),
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'حدث خطأ في الخادم.';
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: msg })}\n\n`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
