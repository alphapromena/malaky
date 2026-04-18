import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Mode } from '@/types/database';
import { generateTitle } from '@/lib/utils';

type Client = SupabaseClient<Database>;

export async function getOrCreateConversation(
  supabase: Client,
  params: {
    userId: string;
    mode: Mode;
    conversationId?: string | null;
    firstUserMessage?: string;
    dialectUsed?: string | null;
  },
) {
  if (params.conversationId) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', params.conversationId)
      .eq('user_id', params.userId)
      .maybeSingle();
    if (error) throw error;
    if (data) return data;
  }

  const { data: created, error: insertErr } = await supabase
    .from('conversations')
    .insert({
      user_id: params.userId,
      mode: params.mode,
      title: params.firstUserMessage ? generateTitle(params.firstUserMessage) : null,
      dialect_used: params.dialectUsed ?? null,
    })
    .select('*')
    .single();

  if (insertErr) throw insertErr;
  return created;
}

export async function saveMessage(
  supabase: Client,
  params: {
    conversationId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    modelUsed?: string;
    tokensInput?: number;
    tokensOutput?: number;
    costUsd?: number;
    latencyMs?: number;
  },
) {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: params.conversationId,
      role: params.role,
      content: params.content,
      model_used: params.modelUsed ?? null,
      tokens_input: params.tokensInput ?? null,
      tokens_output: params.tokensOutput ?? null,
      cost_usd: params.costUsd ?? null,
      latency_ms: params.latencyMs ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;

  await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', params.conversationId);

  return data;
}

export async function listConversations(supabase: Client, userId: string, mode?: Mode) {
  let query = supabase
    .from('conversations')
    .select('id, mode, title, dialect_used, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .limit(100);
  if (mode) query = query.eq('mode', mode);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function listMessages(supabase: Client, conversationId: string, userId: string) {
  const { data: conv } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .eq('user_id', userId)
    .maybeSingle();
  if (!conv) return null;

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function listImages(supabase: Client, conversationId: string, userId: string) {
  const { data, error } = await supabase
    .from('generated_images')
    .select('*')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function deleteConversation(supabase: Client, id: string, userId: string) {
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);
  if (error) throw error;
}
