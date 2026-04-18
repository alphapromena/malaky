const ARABIZI_MAP: Record<string, string> = {
  '2': 'ء',
  '3': 'ع',
  '5': 'خ',
  '6': 'ط',
  '7': 'ح',
  '8': 'غ',
  '9': 'ق',
};

const LATIN_WORD = /\b[a-zA-Z0-9]*[23456789][a-zA-Z0-9]*\b/g;

export function isLikelyArabizi(text: string): boolean {
  const latinWithDigits = text.match(LATIN_WORD);
  if (!latinWithDigits || latinWithDigits.length === 0) return false;
  const hasArabicScript = /[\u0600-\u06FF]/.test(text);
  return !hasArabicScript && latinWithDigits.length >= 1;
}

export function normalizeArabizi(text: string): string {
  if (!isLikelyArabizi(text)) return text;
  let out = text;
  for (const [digit, letter] of Object.entries(ARABIZI_MAP)) {
    out = out.replaceAll(digit, letter);
  }
  return out;
}

export function annotateIfArabizi(text: string): string {
  if (!isLikelyArabizi(text)) return text;
  const normalized = normalizeArabizi(text);
  return `[المستخدم كتب بالعربيزي — النص الأصلي: ${text}\nتحويل تقريبي للعربية: ${normalized}]`;
}
