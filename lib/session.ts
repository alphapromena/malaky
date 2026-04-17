import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

export const SESSION_COOKIE = 'malaky_session';
export const UNLOCK_COOKIE = 'malaky_unlocked';

const THIRTY_DAYS = 60 * 60 * 24 * 30;

export function getSessionId(): string {
  const store = cookies();
  const existing = store.get(SESSION_COOKIE)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(SESSION_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: THIRTY_DAYS,
  });
  return id;
}

export function readSessionId(): string | null {
  return cookies().get(SESSION_COOKIE)?.value ?? null;
}

export function isUnlocked(): boolean {
  return cookies().get(UNLOCK_COOKIE)?.value === 'true';
}
