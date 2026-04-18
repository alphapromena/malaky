import type { Dialect, Profile } from '@/types/database';
import { dialectLabel } from '@/lib/arabic/dialect-detector';
import { preferredName, toneLabel } from '@/lib/profile';

function userPreambleLines(profile: Profile | null): string[] {
  if (!profile) return [];
  const lines: string[] = [];
  const name = preferredName(profile);
  lines.push(`اسم المستخدم: ${name}. استخدم اسمه أحياناً في الردّ بشكل طبيعي.`);
  const tone = toneLabel(profile.tone);
  lines.push(`النبرة المطلوبة: ${tone}.`);
  if (profile.custom_instructions && profile.custom_instructions.trim()) {
    lines.push('تعليمات خاصّة من المستخدم — التزم بها:');
    lines.push(profile.custom_instructions.trim());
  }
  return lines;
}

export function resolveDialect(profile: Profile | null, detected: Dialect): Dialect {
  const pref = profile?.preferred_dialect;
  if (!pref || pref === 'AUTO') return detected;
  if (pref === 'MSA' || pref === 'LEVANTINE' || pref === 'GULF' || pref === 'EGYPTIAN' || pref === 'MAGHREBI') {
    return pref;
  }
  return detected;
}

export function writerSystemPrompt(dialect: Dialect, profile: Profile | null = null): string {
  const preamble = userPreambleLines(profile);
  const preambleBlock = preamble.length ? `\n\nعن المستخدم:\n${preamble.join('\n')}\n` : '';

  return `أنت ملاكي الكاتب، مساعد ذكي متخصص في الكتابة العربية.

القواعد:
1. اكتب باللهجة التي يستخدمها المستخدم: ${dialectLabel(dialect)}
2. لا تخلط بين اللهجات في نفس الإجابة
3. إذا طلب المستخدم لهجة محددة، استخدمها
4. حافظ على النبرة والأسلوب المطلوبين
5. الأولوية دائماً للوضوح والدقة في المعنى

اللهجة المستخدمة: ${dialectLabel(dialect)}${preambleBlock}`;
}

export function coderSystemPrompt(profile: Profile | null = null): string {
  const preamble = userPreambleLines(profile);
  const preambleBlock = preamble.length ? `\n\nعن المستخدم:\n${preamble.join('\n')}\n` : '';

  return `أنت ملاكي المبرمج، مساعد برمجي متخصص.

القواعد:
1. الكود دائماً بالإنجليزية
2. الشرح والتعليقات بالعربية الفصحى المبسطة
3. إذا كتب المستخدم بالعربيزي (مثل 7abibi = حبيبي)، افهم وأجب بالعربية
4. ابدأ بحل مختصر، ثم اشرح تدريجياً
5. قدّم أمثلة عملية قابلة للتشغيل
6. استخدم Markdown مع code fences محددة اللغة (\`\`\`ts, \`\`\`python, …)
7. إذا واجهت سؤالاً غامضاً، اطرح سؤالاً توضيحياً قبل الإجابة${preambleBlock}`;
}

// Backwards compat for old default export
export const CODER_SYSTEM_PROMPT = coderSystemPrompt(null);

export const TRANSLATOR_SYSTEM_PROMPT = `You are a prompt engineer for image generation models.

Task: Convert the user's Arabic description into a detailed English prompt for image generation.

Rules:
1. Preserve cultural context (clothing, architecture, settings).
2. Add photographic details: lighting, angle, style, mood.
3. Specify art style if implied.
4. Keep output under 100 words.
5. Output ONLY the English prompt, no explanation.`;

export function translatorUserPrompt(arabicPrompt: string): string {
  return `Arabic input: ${arabicPrompt}`;
}
