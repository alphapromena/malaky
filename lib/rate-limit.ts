import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Mode } from '@/types/database';

type Client = SupabaseClient<Database>;

export const DAILY_LIMITS: Record<Mode, number> = {
  WRITER: 20,
  CODER: 10,
  DESIGNER: 5,
};

const DAY_MS = 24 * 60 * 60 * 1000;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: Date;
};

export async function checkAndIncrementRateLimit(
  supabase: Client,
  userId: string,
  mode: Mode,
): Promise<RateLimitResult> {
  const limit = DAILY_LIMITS[mode];
  const now = new Date();

  const { data: existing } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('user_id', userId)
    .eq('mode', mode)
    .maybeSingle();

  let count = existing?.count ?? 0;
  let resetAt = existing?.reset_at
    ? new Date(existing.reset_at)
    : new Date(now.getTime() + DAY_MS);

  if (!existing || resetAt.getTime() <= now.getTime()) {
    count = 0;
    resetAt = new Date(now.getTime() + DAY_MS);
  }

  if (count >= limit) {
    return { allowed: false, remaining: 0, limit, resetAt };
  }

  const newCount = count + 1;

  await supabase.from('rate_limits').upsert(
    {
      user_id: userId,
      mode,
      count: newCount,
      reset_at: resetAt.toISOString(),
    },
    { onConflict: 'user_id,mode' },
  );

  return { allowed: true, remaining: limit - newCount, limit, resetAt };
}
