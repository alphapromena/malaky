import type { Mode } from '@/types/database';
import { PenLine, Code2, Palette } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ModeConfig = {
  mode: Mode;
  slug: 'writer' | 'coder' | 'designer';
  nameAr: string;
  tagline: string;
  placeholder: string;
  icon: LucideIcon;
  accent: string;
  limit: number;
  limitUnit: string;
};

export const MODES: ModeConfig[] = [
  {
    mode: 'WRITER',
    slug: 'writer',
    nameAr: 'ملاكي الكاتب',
    tagline: 'اكتب محتوى عربي يفهم لهجتك',
    placeholder: 'اكتب أي شي بدك الكاتب يساعدك فيه… (Ctrl/⌘ + Enter للإرسال)',
    icon: PenLine,
    accent: 'from-sky-500 to-indigo-600',
    limit: 20,
    limitUnit: 'رسالة',
  },
  {
    mode: 'CODER',
    slug: 'coder',
    nameAr: 'ملاكي المبرمج',
    tagline: 'كود بالإنجليزية، شرح بالعربية',
    placeholder: 'اسأل عن الكود، اكتب بالعربي أو بالعربيزي (2, 3, 5, 7…)',
    icon: Code2,
    accent: 'from-emerald-500 to-teal-600',
    limit: 10,
    limitUnit: 'رسالة',
  },
  {
    mode: 'DESIGNER',
    slug: 'designer',
    nameAr: 'ملاكي المصمم',
    tagline: 'وصف بالعربي، صورة فورية',
    placeholder: 'صف الصورة التي تريد: مثال «قهوة عربية فوق طاولة خشبية قديمة، ضوء ذهبي…»',
    icon: Palette,
    accent: 'from-amber-500 to-rose-600',
    limit: 5,
    limitUnit: 'صورة',
  },
];

export function getModeConfig(slug: string): ModeConfig | null {
  return MODES.find((m) => m.slug === slug) ?? null;
}

export function getModeConfigByMode(mode: Mode): ModeConfig {
  return MODES.find((m) => m.mode === mode)!;
}
