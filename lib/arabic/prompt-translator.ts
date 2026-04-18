import { completeClaude, TRANSLATOR_MODEL } from '@/lib/ai/claude';
import { TRANSLATOR_SYSTEM_PROMPT, translatorUserPrompt } from '@/lib/ai/prompts';

export type TranslationResult = {
  englishPrompt: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
};

export async function translateArabicPromptToEnglish(
  arabicPrompt: string,
): Promise<TranslationResult> {
  const { text, inputTokens, outputTokens, latencyMs } = await completeClaude({
    model: TRANSLATOR_MODEL,
    system: TRANSLATOR_SYSTEM_PROMPT,
    userText: translatorUserPrompt(arabicPrompt),
    maxTokens: 300,
    temperature: 0.4,
  });

  const englishPrompt = text.replace(/^["']|["']$/g, '').trim();
  if (!englishPrompt) {
    throw new Error('فشلت ترجمة الوصف إلى الإنجليزية.');
  }

  return { englishPrompt, inputTokens, outputTokens, latencyMs };
}
