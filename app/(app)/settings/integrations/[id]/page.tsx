import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ExternalLink, CheckCircle2 } from 'lucide-react';
import { requireAuthUser } from '@/lib/auth';
import { getServerClient } from '@/lib/supabase/server';
import { CATEGORY_LABELS, STATUS_LABELS, getIntegration } from '@/lib/integrations/catalog';
import { Button } from '@/components/ui/button';
import { ToggleIntegration } from '@/components/settings/ToggleIntegration';
import { cn } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const i = getIntegration(params.id);
  return { title: i ? `${i.nameAr} — ملاكي` : 'التكاملات — ملاكي' };
}

const AUTH_TYPE_LABELS: Record<string, { ar: string; hint: string }> = {
  native:    { ar: 'مدمج',          hint: 'يستخدم الأدوات الأصلية لـ Claude — بدون إعداد خارجي.' },
  'api-key': { ar: 'مفتاح API',     hint: 'ألصق مفتاح API خاصتك لتفعيله.' },
  oauth:    { ar: 'OAuth',          hint: 'ستتم إعادة توجيهك للموافقة على الوصول.' },
  webhook:  { ar: 'Webhook',        hint: 'سيتم إعداد webhook URL عند التفعيل.' },
  admin:    { ar: 'يُدار من قِبل المنصّة', hint: 'سيتم تفعيله من قِبل فريق ملاكي، لا يحتاج منك إعداد.' },
};

export default async function IntegrationDetailPage({ params }: { params: { id: string } }) {
  const integration = getIntegration(params.id);
  if (!integration) notFound();

  const { user } = await requireAuthUser();
  const supabase = getServerClient();
  const { data: row } = await supabase
    .from('user_integrations')
    .select('status, connected_at')
    .eq('user_id', user.id)
    .eq('provider', integration.id)
    .maybeSingle();

  const isConnected = row?.status === 'connected';
  const Icon = integration.icon;
  const badge = STATUS_LABELS[integration.status];
  const auth = AUTH_TYPE_LABELS[integration.authType];

  const canEnable = integration.status === 'available' && integration.authType === 'native';

  return (
    <div className="p-6 sm:p-10">
      <Button asChild variant="ghost" size="sm" className="mb-6 -ms-2 gap-1">
        <Link href="/settings/integrations">
          <ArrowRight className="h-4 w-4" />
          كل التكاملات
        </Link>
      </Button>

      <header className="mb-8 flex items-start gap-5">
        <div
          className={cn(
            'flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-border bg-canvas-raised',
            isConnected && 'ring-1 ring-gold-400/40 shadow-glow',
          )}
        >
          <Icon className={cn('h-7 w-7', isConnected ? 'text-gold-300' : 'text-ink-muted')} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-latin text-[10px] uppercase tracking-[0.18em] text-ink-subtle">
              {CATEGORY_LABELS[integration.category].en} · {CATEGORY_LABELS[integration.category].ar}
            </span>
            {isConnected ? (
              <span className="flex items-center gap-1 rounded-full border border-gold-400/40 bg-gold-400/10 px-2 py-0.5 text-[10px] font-semibold text-gold-300">
                <CheckCircle2 className="h-3 w-3" /> متصل
              </span>
            ) : (
              <span
                className={cn(
                  'rounded-full border px-2 py-0.5 font-latin text-[9px] uppercase tracking-[0.15em]',
                  badge.tone === 'ok'
                    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400'
                    : badge.tone === 'warn'
                      ? 'border-terracotta-400/30 bg-terracotta-400/10 text-terracotta-400'
                      : 'border-border bg-white/[0.03] text-ink-subtle',
                )}
              >
                {badge.ar}
              </span>
            )}
          </div>
          <h1 className="ds-display text-3xl font-bold">{integration.nameAr}</h1>
          <p className="mt-1 font-latin text-sm text-ink-muted">{integration.name}</p>
        </div>
      </header>

      <section className="mb-10">
        <p className="text-base leading-relaxed text-ink-muted">{integration.description}</p>
      </section>

      {/* Capabilities */}
      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-subtle">
          الإمكانيات
        </h2>
        <ul className="space-y-2">
          {integration.capabilities.map((c) => (
            <li
              key={c}
              className="flex items-start gap-3 rounded-xl border border-border bg-white/[0.02] px-4 py-3 text-sm"
            >
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-gold-300 to-gold-600" />
              <span className="text-ink-muted">{c}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Connection setup */}
      <section className="rounded-2xl border border-border bg-white/[0.02] p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold">طريقة الربط</p>
            <p className="mt-1 text-xs text-ink-muted">
              <span className="font-latin uppercase tracking-wider text-ink-subtle">
                {auth.ar}
              </span>
              {' · '}
              {auth.hint}
            </p>
          </div>
          {integration.docsUrl && (
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <a href={integration.docsUrl} target="_blank" rel="noopener noreferrer">
                التوثيق
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
        </div>

        {canEnable ? (
          <ToggleIntegration id={integration.id} connected={isConnected} />
        ) : (
          <Button disabled className="w-full" size="lg">
            قريباً — الربط سيُفتح للمستخدمين عمّا قريب
          </Button>
        )}
      </section>
    </div>
  );
}
