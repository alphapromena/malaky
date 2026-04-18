import type { Mode } from '@/types/database';
import { PenLine, Code2, Palette } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type ModeConfig = {
  mode: Mode;
  slug: 'writer' | 'coder' | 'designer';
  nameAr: string;
  nameEn: string;
  tagline: string;
  placeholder: string;
  icon: LucideIcon;
  /** Tailwind gradient classes (warm, on-brand) */
  accent: string;
  glow: string;
  limit: number;
  limitUnit: string;
};

export const MODES: ModeConfig[] = [
  {
    mode: 'WRITER',
    slug: 'writer',
    nameAr: 'الكاتب',
    nameEn: 'Writer',
    tagline: 'اكتب محتوى عربي يفهم لهجتك',
    placeholder: 'اكتب أي شي بدك المساعدة فيه…',
    icon: PenLine,
    accent: 'from-gold-300 to-gold-500',
    glow: 'shadow-[0_20px_60px_-12px_rgba(184,149,106,0.45)]',
    limit: 20,
    limitUnit: 'رسالة',
  },
  {
    mode: 'CODER',
    slug: 'coder',
    nameAr: 'المبرمج',
    nameEn: 'Coder',
    tagline: 'كود بالإنجليزية، شرح بالعربية',
    placeholder: 'اسأل عن الكود، اكتب بالعربي أو بالعربيزي…',
    icon: Code2,
    accent: 'from-gold-400 to-gold-700',
    glow: 'shadow-[0_20px_60px_-12px_rgba(127,96,56,0.45)]',
    limit: 10,
    limitUnit: 'رسالة',
  },
  {
    mode: 'DESIGNER',
    slug: 'designer',
    nameAr: 'المصمم',
    nameEn: 'Designer',
    tagline: 'وصف بالعربي، صورة فورية',
    placeholder: 'صف الصورة التي تريد بالتفصيل…',
    icon: Palette,
    accent: 'from-terracotta-400 to-gold-400',
    glow: 'shadow-[0_20px_60px_-12px_rgba(216,141,112,0.45)]',
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
