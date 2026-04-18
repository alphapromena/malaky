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
  /** Vibrant tailwind gradient — from/via/to classes */
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
    placeholder: 'اكتب أي شي بدك الكاتب يساعدك فيه…',
    icon: PenLine,
    accent: 'from-emerald-400 via-cyan-400 to-cyan-500',
    glow: 'shadow-[0_20px_60px_-12px_rgba(16,185,129,0.45)]',
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
    accent: 'from-violet-500 via-violet-500 to-indigo-500',
    glow: 'shadow-[0_20px_60px_-12px_rgba(139,92,246,0.55)]',
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
    accent: 'from-pink-500 via-pink-500 to-orange-500',
    glow: 'shadow-[0_20px_60px_-12px_rgba(236,72,153,0.55)]',
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
