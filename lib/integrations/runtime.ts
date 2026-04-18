import type { SupabaseClient } from '@supabase/supabase-js';
import type Anthropic from '@anthropic-ai/sdk';
import type { Database } from '@/types/database';

type Client = SupabaseClient<Database>;

export async function getConnectedProviders(supabase: Client, userId: string): Promise<Set<string>> {
  const { data } = await supabase
    .from('user_integrations')
    .select('provider')
    .eq('user_id', userId)
    .eq('status', 'connected');
  return new Set((data ?? []).map((r) => r.provider));
}

/**
 * Turn connected providers into Anthropic `tools` entries. Only the native
 * server-tools are emitted here; OAuth / API-key providers will be added as
 * their flows land.
 */
export function toolsFor(connected: Set<string>): Anthropic.ToolUnion[] {
  const tools: Anthropic.ToolUnion[] = [];
  if (connected.has('web-search')) {
    // Claude's server-side web search tool (native — no SerpAPI needed).
    tools.push({
      type: 'web_search_20250305',
      name: 'web_search',
      max_uses: 3,
    } as unknown as Anthropic.ToolUnion);
  }
  return tools;
}
