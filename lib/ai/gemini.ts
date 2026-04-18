import { GoogleGenAI } from '@google/genai';

export const IMAGE_MODEL = 'gemini-2.5-flash-image-preview';

let cachedClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (cachedClient) return cachedClient;
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) throw new Error('GOOGLE_AI_API_KEY is missing.');
  cachedClient = new GoogleGenAI({ apiKey });
  return cachedClient;
}

export type GeneratedImagePayload = {
  bytes: Buffer;
  mimeType: string;
  latencyMs: number;
};

export async function generateImage(englishPrompt: string): Promise<GeneratedImagePayload> {
  const started = Date.now();
  const client = getClient();

  const response = await client.models.generateContent({
    model: IMAGE_MODEL,
    contents: [{ role: 'user', parts: [{ text: englishPrompt }] }],
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      const bytes = Buffer.from(part.inlineData.data, 'base64');
      return {
        bytes,
        mimeType: part.inlineData.mimeType ?? 'image/png',
        latencyMs: Date.now() - started,
      };
    }
  }

  throw new Error('لم يُرجع نموذج التوليد أي صورة. جرّب وصفاً أوضح.');
}

export const IMAGE_COST_USD = 0.039;
