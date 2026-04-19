import { NextResponse } from 'next/server';
import { getServerClient } from '@/lib/supabase/server';
import { DAILY_LIMITS } from '@/lib/rate-limit';
import type { Mode } from '@/types/database';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'يجب تسجيل الدخول.' }, { status: 401 });
  }

  const { data: rows } = await supabase
    .from('rate_limits')
    .select('mode, count, reset_at')
    .eq('user_id', user.id);

  const now = Date.now();
  const modes: Mode[] = ['WRITER', 'CODER', 'DESIGNER'];
  const usage: Record<Mode, { used: number; limit: number; resetAt: string | null }> = {
    WRITER: { used: 0, limit: DAILY_LIMITS.WRITER, resetAt: null },
    CODER: { used: 0, limit: DAILY_LIMITS.CODER, resetAt: null },
    DESIGNER: { used: 0, limit: DAILY_LIMITS.DESIGNER, resetAt: null },
  };

  for (const m of modes) {
    const row = rows?.find((r) => r.mode === m);
    const resetAt = row?.reset_at ? new Date(row.reset_at) : null;
    const active = resetAt && resetAt.getTime() > now;
    usage[m] = {
      used: active ? row?.count ?? 0 : 0,
      limit: DAILY_LIMITS[m],
      resetAt: active ? resetAt!.toISOString() : null,
    };
  }

  return NextResponse.json({ usage });
}
