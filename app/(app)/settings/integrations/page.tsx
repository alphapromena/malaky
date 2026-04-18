import Link from 'next/link';
import { ArrowLeft, CircleDot } from 'lucide-react';
import { requireAuthUser } from '@/lib/auth';
import { getServerClient } from '@/lib/supabase/server';
import {
  CATEGORY_LABELS,
  INTEGRATIONS,
  STATUS_LABELS,
  integrationsByCategory,
} from '@/lib/integrations/catalog';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'التكاملات — ملاكي' };

export default async function IntegrationsPage() {
  const { user } = await requireAuthUser();
  const supabase = getServerClient();
  const { data: rows } = await supabase
    .from('user_integrations')
    .select('provider, status')
    .eq('user_id', user.id);

  const connected = new Set((rows ?? []).filter((r) => r.status === 'connected').map((r) => r.provider));
  const connectedCount = connected.size;
  const totalAvailable = INTEGRATIONS.filter((i) => i.status === 'available').length;

  return (
    <div className="p-6 sm:p-10">
      <header className="mb-8">
        <p className="font-latin text-[10px] uppercase tracking-[0.18em] text-ink-subtle">
          Integrations
        </p>
        <h1 className="ds-display mt-1 text-3xl font-bold">التكاملات</h1>
        <p className="mt-2 text-sm text-ink-muted">
          وصّل ملاكي بأدواتك المفضّلة — حالياً {connectedCount} متصلة من أصل {totalAvailable} متاحة.
        </p>
      </header>

      <div className="space-y-10">
        {integrationsByCategory().map(({ category, items }) => (
          <section key={category}>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-lg font-semibold">{CATEGORY_LABELS[category].ar}</h2>
              <span className="font-latin text-[10px] uppercase tracking-[0.18em] text-ink-subtle">
                {CATEGORY_LABELS[category].en}
              </span>
            </div>

            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {items.map((i) => {
                const isConnected = connected.has(i.id);
                const Icon = i.icon;
                const badge = STATUS_LABELS[i.status];
                return (
                  <li key={i.id}>
                    <Link
                      href={`/settings/integrations/${i.id}`}
                      className="group relative flex items-start gap-4 overflow-hidden rounded-2xl border border-border bg-white/[0.02] p-5 transition-all duration-fast hover:-translate-y-0.5 hover:border-gold-400/40 hover:bg-white/[0.04]"
                    >
                      <div
                        className={cn(
                          'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-canvas-raised',
                          isConnected && 'ring-1 ring-gold-400/40',
                        )}
                      >
                        <Icon
                          className={cn('h-5 w-5', isConnected ? 'text-gold-300' : 'text-ink-muted')}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold leading-tight">{i.nameAr}</p>
                            <p className="font-latin text-[10px] uppercase tracking-wider text-ink-subtle">
                              {i.name}
                            </p>
                          </div>
                          <StatusPill connected={isConnected} label={badge.ar} tone={badge.tone} />
                        </div>
                        <p className="mt-2 text-xs leading-relaxed text-ink-muted">{i.summary}</p>
                      </div>

                      <ArrowLeft className="mt-2 h-4 w-4 shrink-0 text-ink-subtle transition-transform duration-fast group-hover:-translate-x-1 group-hover:text-gold-300" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function StatusPill({
  connected,
  label,
  tone,
}: {
  connected: boolean;
  label: string;
  tone: 'ok' | 'warn' | 'soon';
}) {
  if (connected) {
    return (
      <span className="flex shrink-0 items-center gap-1 rounded-full border border-gold-400/40 bg-gold-400/10 px-2 py-0.5 text-[10px] font-semibold text-gold-300">
        <CircleDot className="h-3 w-3" />
        متصل
      </span>
    );
  }
  const toneCls =
    tone === 'ok'
      ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400'
      : tone === 'warn'
        ? 'border-terracotta-400/30 bg-terracotta-400/10 text-terracotta-400'
        : 'border-border bg-white/[0.03] text-ink-subtle';
  return (
    <span
      className={cn(
        'shrink-0 rounded-full border px-2 py-0.5 font-latin text-[9px] uppercase tracking-[0.15em]',
        toneCls,
      )}
    >
      {label}
    </span>
  );
}
