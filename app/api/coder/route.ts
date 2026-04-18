import { z } from 'zod';
import { getServerClient } from '@/lib/supabase/server';
import { getOrCreateConversation, saveMessage } from '@/lib/db';
import { annotateIfArabizi } from '@/lib/arabic/arabizi';
import { coderSystemPrompt } from '@/lib/ai/prompts';
import { CODER_MODEL, estimateCostUsd, streamClaude } from '@/lib/ai/claude';
import { checkAndIncrementRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  conversationId: z.string().uuid().nullable().optional(),
  message: z.string().min(1).max(12000),
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

  const rate = await checkAndIncrementRateLimit(supabase, user.id, 'CODER');
  if (!rate.allowed) {
    return new Response(
      JSON.stringify({
        error: `لقد بلغت حدّ المبرمج اليومي (${rate.limit} رسالة). جرّب مجدداً بعد ${new Date(rate.resetAt).toLocaleString('ar-EG')}`,
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
  const annotatedMessage = annotateIfArabizi(message);

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  const conversation = await getOrCreateConversation(supabase, {
    userId: user.id,
    mode: 'CODER',
    conversationId: conversationId ?? null,
    firstUserMessage: message,
  });

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
            `event: meta\ndata: ${JSON.stringify({ conversationId: conversation.id })}\n\n`,
          ),
        );

        const result = await streamClaude({
          model: CODER_MODEL,
          system: coderSystemPrompt(profile),
          messages: [...historyMessages, { role: 'user', content: annotatedMessage }],
          maxTokens: 8192,
          temperature: 0.3,
          onToken: (delta) => {
            controller.enqueue(encoder.encode(`event: token\ndata: ${JSON.stringify(delta)}\n\n`));
          },
        });

        await saveMessage(supabase, {
          conversationId: conversation.id,
          role: 'assistant',
          content: result.fullText,
          modelUsed: CODER_MODEL,
          tokensInput: result.inputTokens,
          tokensOutput: result.outputTokens,
          costUsd: estimateCostUsd(result.inputTokens, result.outputTokens, CODER_MODEL),
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
