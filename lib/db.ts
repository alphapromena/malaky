import { getServiceClient } from '@/lib/supabase/server';
import { generateTitle } from '@/lib/utils';
import type { Mode } from '@/types/database';

export async function getOrCreateConversation(params: {
  sessionId: string;
  mode: Mode;
  conversationId?: string | null;
  firstUserMessage?: string;
  dialectUsed?: string | null;
}) {
  const supabase = getServiceClient();

  if (params.conversationId) {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', params.conversationId)
      .eq('session_id', params.sessionId)
      .maybeSingle();
    if (error) throw error;
    if (data) return data;
  }

  const { data: created, error: insertErr } = await supabase
    .from('conversations')
    .insert({
      session_id: params.sessionId,
      mode: params.mode,
      title: params.firstUserMessage ? generateTitle(params.firstUserMessage) : null,
      dialect_used: params.dialectUsed ?? null,
    })
    .select('*')
    .single();

  if (insertErr) throw insertErr;
  return created;
}

export async function saveMessage(params: {
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  modelUsed?: string;
  tokensInput?: number;
  tokensOutput?: number;
  costUsd?: number;
  latencyMs?: number;
}) {
  const supabase = getServiceClient();
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

export async function listConversations(sessionId: string, mode?: Mode) {
  const supabase = getServiceClient();
  let query = supabase
    .from('conversations')
    .select('id, mode, title, dialect_used, created_at, updated_at')
    .eq('session_id', sessionId)
    .order('updated_at', { ascending: false })
    .limit(100);

  if (mode) query = query.eq('mode', mode);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function listMessages(conversationId: string, sessionId: string) {
  const supabase = getServiceClient();
  const { data: conv } = await supabase
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .eq('session_id', sessionId)
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

export async function listImages(conversationId: string, sessionId: string) {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('generated_images')
    .select('*')
    .eq('conversation_id', conversationId)
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function deleteConversation(id: string, sessionId: string) {
  const supabase = getServiceClient();
  const { error } = await supabase
    .from('conversations')
    .delete()
    .eq('id', id)
    .eq('session_id', sessionId);
  if (error) throw error;
}
