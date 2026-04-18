import Anthropic from '@anthropic-ai/sdk';

export const WRITER_MODEL = 'claude-sonnet-4-6';
export const CODER_MODEL = 'claude-opus-4-7';
export const TRANSLATOR_MODEL = 'claude-sonnet-4-6';

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string | Anthropic.ContentBlockParam[];
};

let cachedClient: Anthropic | null = null;

function getClient(): Anthropic {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is missing.');
  cachedClient = new Anthropic({ apiKey });
  return cachedClient;
}

export type StreamCallbacks = {
  onToken?: (text: string) => void;
  onDone?: (result: {
    fullText: string;
    inputTokens: number;
    outputTokens: number;
    latencyMs: number;
  }) => void;
};

export async function streamClaude(params: {
  model: string;
  system: string;
  messages: ChatMessage[];
  maxTokens?: number;
  temperature?: number;
  onToken?: (delta: string) => void;
}) {
  const started = Date.now();
  const client = getClient();

  const stream = client.messages.stream({
    model: params.model,
    system: params.system,
    max_tokens: params.maxTokens ?? 4096,
    temperature: params.temperature ?? 0.7,
    messages: params.messages.map((m) => ({ role: m.role, content: m.content })),
  });

  let fullText = '';
  let inputTokens = 0;
  let outputTokens = 0;

  for await (const event of stream) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      const chunk = event.delta.text;
      fullText += chunk;
      params.onToken?.(chunk);
    } else if (event.type === 'message_delta' && event.usage) {
      outputTokens = event.usage.output_tokens;
    } else if (event.type === 'message_start' && event.message.usage) {
      inputTokens = event.message.usage.input_tokens;
    }
  }

  const latencyMs = Date.now() - started;
  return { fullText, inputTokens, outputTokens, latencyMs };
}

export async function completeClaude(params: {
  model: string;
  system: string;
  userText: string;
  maxTokens?: number;
  temperature?: number;
}) {
  const started = Date.now();
  const client = getClient();
  const response = await client.messages.create({
    model: params.model,
    system: params.system,
    max_tokens: params.maxTokens ?? 512,
    temperature: params.temperature ?? 0.3,
    messages: [{ role: 'user', content: params.userText }],
  });

  const text = response.content
    .filter((c): c is Anthropic.TextBlock => c.type === 'text')
    .map((c) => c.text)
    .join('\n')
    .trim();

  return {
    text,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
    latencyMs: Date.now() - started,
  };
}

export function estimateCostUsd(
  inputTokens: number,
  outputTokens: number,
  model: string,
): number {
  const rates: Record<string, { input: number; output: number }> = {
    'claude-sonnet-4-6': { input: 3, output: 15 },
    'claude-opus-4-7': { input: 15, output: 75 },
  };
  const rate = rates[model] ?? rates['claude-sonnet-4-6']!;
  return Number(((inputTokens * rate.input + outputTokens * rate.output) / 1_000_000).toFixed(6));
}
