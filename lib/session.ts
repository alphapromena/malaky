import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

export const SESSION_COOKIE = 'malaky_session';
export const UNLOCK_COOKIE = 'malaky_unlocked';

/**
 * Read the session id set by middleware. If middleware hasn't run yet (rare edge
 * cases such as dev-time prefetching), fall back to a generated id that won't be
 * persisted; the next request will get a real cookie set by middleware.
 */
export function getSessionId(): string {
  const existing = cookies().get(SESSION_COOKIE)?.value;
  if (existing) return existing;
  return randomUUID();
}

export function readSessionId(): string | null {
  return cookies().get(SESSION_COOKIE)?.value ?? null;
}

export function isUnlocked(): boolean {
  return cookies().get(UNLOCK_COOKIE)?.value === 'true';
}
