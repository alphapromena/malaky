import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  firstName: z.string().trim().min(2).max(40),
  lastName: z.string().trim().min(2).max(40),
  nickname: z.string().trim().min(1).max(40).nullable(),
  preferredDialect: z.enum(['AUTO', 'MSA', 'LEVANTINE', 'GULF', 'EGYPTIAN', 'MAGHREBI']),
  tone: z.enum(['formal', 'friendly', 'playful']),
  customInstructions: z.string().trim().max(1200).nullable(),
});

export async function PATCH(req: Request) {
  const supabase = getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'يجب تسجيل الدخول.' }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'طلب غير صالح.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة.' },
      { status: 400 },
    );
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      first_name: parsed.data.firstName,
      last_name: parsed.data.lastName,
      nickname: parsed.data.nickname,
      preferred_dialect: parsed.data.preferredDialect,
      tone: parsed.data.tone,
      custom_instructions: parsed.data.customInstructions,
    })
    .eq('id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
