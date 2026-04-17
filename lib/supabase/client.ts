import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

let cachedBrowserClient: SupabaseClient<Database> | null = null;

export function getBrowserClient(): SupabaseClient<Database> {
  if (typeof window === 'undefined') {
    throw new Error('getBrowserClient must only be called in the browser.');
  }
  if (cachedBrowserClient) return cachedBrowserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Supabase public env vars missing.');
  }

  cachedBrowserClient = createClient<Database>(url, anonKey, {
    auth: { persistSession: false },
  });

  return cachedBrowserClient;
}
