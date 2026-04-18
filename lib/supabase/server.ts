import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * User-scoped server client. Reads cookies via next/headers so RLS is enforced
 * against the authenticated user. Use this in Server Components, route handlers,
 * and server actions.
 */
export function getServerClient() {
  const cookieStore = cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL / ANON_KEY');
  }

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch {
          /* called from a Server Component — cookie mutation handled by middleware */
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options });
        } catch {
          /* noop in Server Components */
        }
      },
    },
  });
}

/**
 * Admin client with service-role key. Bypasses RLS — use only for trusted
 * server-only operations (e.g. storage uploads owned by a user we've already
 * verified, or cross-user admin queries). Never expose via client code.
 */
let cachedAdminClient: SupabaseClient<Database> | null = null;
export function getAdminClient(): SupabaseClient<Database> {
  if (cachedAdminClient) return cachedAdminClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Supabase admin env vars missing.');
  }
  cachedAdminClient = createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedAdminClient;
}
