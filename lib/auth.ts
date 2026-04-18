import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { getServerClient } from '@/lib/supabase/server';
import type { Profile } from '@/types/database';

export type AuthUser = {
  user: User;
  profile: Profile | null;
};

/**
 * Returns the authenticated user + profile, or null. Cached per-request so
 * multiple components can call it without extra round-trips.
 */
export const getAuthUser = cache(async (): Promise<AuthUser | null> => {
  const supabase = getServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', data.user.id)
    .maybeSingle();

  return { user: data.user, profile: profile ?? null };
});

/**
 * Guard used in protected Server Components. Redirects to /login if signed out,
 * or /signup if signed in but profile missing (e.g. Google sign-up).
 */
export async function requireAuthUser(): Promise<AuthUser> {
  const auth = await getAuthUser();
  if (!auth) redirect('/login');
  if (!auth.profile) redirect('/signup?complete=1');
  return auth;
}
