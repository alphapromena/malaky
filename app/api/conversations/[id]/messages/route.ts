import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase/server';
import { listImages, listMessages } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const supabase = getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول.' }, { status: 401 });
  }
  const messages = await listMessages(supabase, params.id, user.id);
  if (messages === null) {
    return NextResponse.json({ error: 'المحادثة غير موجودة.' }, { status: 404 });
  }
  const images = await listImages(supabase, params.id, user.id);
  return NextResponse.json({ messages, images });
}
