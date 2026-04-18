import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase/server';
import { listConversations } from '@/lib/db';
import type { Mode } from '@/types/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED_MODES: readonly Mode[] = ['WRITER', 'CODER', 'DESIGNER'];

export async function GET(req: Request) {
  const supabase = getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول.' }, { status: 401 });
  }

  const url = new URL(req.url);
  const modeParam = url.searchParams.get('mode');
  const mode =
    modeParam && ALLOWED_MODES.includes(modeParam as Mode) ? (modeParam as Mode) : undefined;

  const conversations = await listConversations(supabase, user.id, mode);
  return NextResponse.json({ conversations });
}
