import type { LucideIcon } from 'lucide-react';
import { Sparkles } from 'lucide-react';

export function ComingSoon({
  icon: Icon = Sparkles,
  title,
  description,
  badge = 'قريباً',
  features,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  features?: string[];
}) {
  return (
    <div className="mx-auto max-w-2xl p-6 sm:p-10">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-canvas-elevated/60 p-10 backdrop-blur-xl">
        <div className="absolute -top-20 -end-20 h-64 w-64 rounded-full bg-gradient-to-br from-gold-300/15 to-terracotta-400/15 blur-3xl" />

        <div className="relative">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-gold-300">
            <Sparkles className="h-3 w-3" />
            {badge}
          </div>

          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-300/25 via-gold-400/25 to-gold-600/25 text-gold-200">
            <Icon className="h-7 w-7" />
          </div>

          <h1 className="ds-display mb-3 text-3xl font-bold">{title}</h1>
          <p className="mb-8 text-base leading-relaxed text-ink-muted">{description}</p>

          {features && features.length > 0 && (
            <ul className="space-y-2">
              {features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 rounded-xl border border-border bg-white/[0.02] px-4 py-3 text-sm"
                >
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-gradient-to-br from-gold-300 to-gold-600" />
                  <span className="text-ink-muted">{f}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
