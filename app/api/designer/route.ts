import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAdminClient, getServerClient } from '@/lib/supabase/server';
import { getOrCreateConversation, saveMessage } from '@/lib/db';
import { translateArabicPromptToEnglish } from '@/lib/arabic/prompt-translator';
import { generateImage, IMAGE_COST_USD, IMAGE_MODEL } from '@/lib/ai/gemini';
import { checkAndIncrementRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  conversationId: z.string().uuid().nullable().optional(),
  prompt: z.string().min(3).max(1000),
});

export async function POST(req: Request) {
  const supabase = getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول.' }, { status: 401 });
  }

  const rate = await checkAndIncrementRateLimit(supabase, user.id, 'DESIGNER');
  if (!rate.allowed) {
    return NextResponse.json(
      {
        error: `لقد بلغت حدّ المصمم اليومي (${rate.limit} صور). جرّب مجدداً بعد ${new Date(rate.resetAt).toLocaleString('ar-EG')}`,
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'الوصف قصير جداً أو طويل جداً.' }, { status: 400 });
  }

  const { prompt, conversationId } = parsed.data;
  const conversation = await getOrCreateConversation(supabase, {
    userId: user.id,
    mode: 'DESIGNER',
    conversationId: conversationId ?? null,
    firstUserMessage: prompt,
  });

  await saveMessage(supabase, { conversationId: conversation.id, role: 'user', content: prompt });

  try {
    const translation = await translateArabicPromptToEnglish(prompt);
    const image = await generateImage(translation.englishPrompt);

    const admin = getAdminClient();
    const ext = image.mimeType.split('/')[1] ?? 'png';
    const storagePath = `${user.id}/${conversation.id}/${Date.now()}.${ext}`;

    const upload = await admin.storage
      .from('malaky-images')
      .upload(storagePath, image.bytes, {
        contentType: image.mimeType,
        cacheControl: '3600',
      });

    if (upload.error) {
      throw new Error(`تعذّر رفع الصورة: ${upload.error.message}`);
    }

    const { data: publicUrl } = admin.storage.from('malaky-images').getPublicUrl(storagePath);

    const { data: saved, error: insertErr } = await supabase
      .from('generated_images')
      .insert({
        user_id: user.id,
        conversation_id: conversation.id,
        arabic_prompt: prompt,
        english_prompt: translation.englishPrompt,
        image_url: publicUrl.publicUrl,
        image_storage_path: storagePath,
        cost_usd: IMAGE_COST_USD,
      })
      .select('*')
      .single();

    if (insertErr) throw insertErr;

    const assistantContent = [
      `![تم توليد الصورة](${publicUrl.publicUrl})`,
      '',
      `**الوصف الإنجليزي المحسّن:**`,
      translation.englishPrompt,
    ].join('\n');

    await saveMessage(supabase, {
      conversationId: conversation.id,
      role: 'assistant',
      content: assistantContent,
      modelUsed: IMAGE_MODEL,
      latencyMs: image.latencyMs,
      costUsd: IMAGE_COST_USD,
    });

    return NextResponse.json({
      conversationId: conversation.id,
      image: saved,
      remaining: rate.remaining,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'فشل توليد الصورة.';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
