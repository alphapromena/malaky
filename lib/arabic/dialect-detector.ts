import type { Dialect } from '@/types/database';

const DIALECT_MARKERS: Record<Exclude<Dialect, 'MSA'>, readonly string[]> = {
  LEVANTINE: ['شو', 'كيفك', 'هلأ', 'بدي', 'منيح', 'كتير', 'هيك', 'لحظة', 'بحبك', 'قديش', 'مبلا'],
  GULF: ['شلون', 'وايد', 'عساك', 'چذي', 'هالحين', 'ابغى', 'ويش', 'توني', 'زين', 'حيل'],
  EGYPTIAN: ['ازيك', 'عامل ايه', 'كده', 'اهو', 'ازاي', 'بقى', 'خالص', 'علشان', 'دلوقتي', 'جدع'],
  MAGHREBI: ['كيفاش', 'بزاف', 'واش', 'دابا', 'بصح', 'مزيان', 'غادي', 'هاد', 'باش', 'راني'],
};

const DIALECT_LABELS_AR: Record<Dialect, string> = {
  MSA: 'الفصحى',
  LEVANTINE: 'الشامية',
  GULF: 'الخليجية',
  EGYPTIAN: 'المصرية',
  MAGHREBI: 'المغاربية',
};

export function detectDialect(text: string): Dialect {
  const normalized = text.toLowerCase();
  const scores: Record<Exclude<Dialect, 'MSA'>, number> = {
    LEVANTINE: 0,
    GULF: 0,
    EGYPTIAN: 0,
    MAGHREBI: 0,
  };

  for (const [dialect, markers] of Object.entries(DIALECT_MARKERS) as Array<
    [Exclude<Dialect, 'MSA'>, readonly string[]]
  >) {
    for (const marker of markers) {
      if (normalized.includes(marker)) scores[dialect] += 1;
    }
  }

  let best: Exclude<Dialect, 'MSA'> | null = null;
  let max = 0;
  for (const [d, s] of Object.entries(scores) as Array<[Exclude<Dialect, 'MSA'>, number]>) {
    if (s > max) {
      max = s;
      best = d;
    }
  }

  return best && max > 0 ? best : 'MSA';
}

export function dialectLabel(dialect: Dialect): string {
  return DIALECT_LABELS_AR[dialect];
}
