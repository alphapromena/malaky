import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase/server';
import { deleteConversation } from '@/lib/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const supabase = getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول.' }, { status: 401 });
  }
  await deleteConversation(supabase, params.id, user.id);
  return NextResponse.json({ ok: true });
}
