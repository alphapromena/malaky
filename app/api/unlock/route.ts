import { NextResponse } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';

const schema = z.object({
  password: z.string().min(1, 'كلمة السر مطلوبة'),
});

const SEVEN_DAYS = 60 * 60 * 24 * 7;

export async function POST(req: Request) {
  const expected = process.env.APP_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: 'الخادم غير مُعدّ بشكل صحيح.' },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'طلب غير صالح.' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة.' },
      { status: 400 },
    );
  }

  if (parsed.data.password !== expected) {
    return NextResponse.json({ ok: false, error: 'كلمة السر غير صحيحة.' }, { status: 401 });
  }

  cookies().set('malaky_unlocked', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SEVEN_DAYS,
  });

  return NextResponse.json({ ok: true });
}
