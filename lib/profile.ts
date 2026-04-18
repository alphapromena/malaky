import type { Profile } from '@/types/database';

export type Tone = 'formal' | 'friendly' | 'playful';
export type PreferredDialect = 'AUTO' | 'MSA' | 'LEVANTINE' | 'GULF' | 'EGYPTIAN' | 'MAGHREBI';

export const TONE_LABELS: Record<Tone, string> = {
  formal: 'رسمية',
  friendly: 'ودّية',
  playful: 'مرحة',
};

export const DIALECT_LABELS: Record<PreferredDialect, string> = {
  AUTO: 'تلقائي (يكتشف من لهجتك)',
  MSA: 'الفصحى',
  LEVANTINE: 'الشامية',
  GULF: 'الخليجية',
  EGYPTIAN: 'المصرية',
  MAGHREBI: 'المغاربية',
};

export function preferredName(profile: Profile | null): string {
  if (!profile) return 'صديقي';
  return profile.nickname?.trim() || profile.first_name;
}

export function toneLabel(tone: string | null | undefined): string {
  const t = (tone ?? 'friendly') as Tone;
  return TONE_LABELS[t] ?? TONE_LABELS.friendly;
}
