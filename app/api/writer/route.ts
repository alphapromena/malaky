import { z } from 'zod';
import { getServerClient } from '@/lib/supabase/server';
import { getOrCreateConversation, saveMessage } from '@/lib/db';
import { detectDialect } from '@/lib/arabic/dialect-detector';
import { writerSystemPrompt } from '@/lib/ai/prompts';
import { WRITER_MODEL, estimateCostUsd, streamClaude } from '@/lib/ai/claude';
import { checkAndIncrementRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  conversationId: z.string().uuid().nullable().optional(),
  message: z.string().min(1).max(8000),
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'طلب غير صالح.' }), { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: 'رسالتك فارغة أو طويلة جداً.' }), { status: 400 });
  }

  const { message, conversationId } = parsed.data;
  const dialect = detectDialect(message);

  const conversation = await getOrCreateConversation(supabase, {
    userId: user.id,
    mode: 'WRITER',
    conversationId: conversationId ?? null,
    firstUserMessage: message,
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

  await saveMessage(supabase, { conversationId: conversation.id, role: 'user', content: message });

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
          system: writerSystemPrompt(dialect),
          messages: [...historyMessages, { role: 'user', content: message }],
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
