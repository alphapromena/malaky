import { requireAuthUser } from '@/lib/auth';
import { getServerClient } from '@/lib/supabase/server';
import { DAILY_LIMITS } from '@/lib/rate-limit';
import { Code2, Gauge, Palette, PenLine, Sparkles } from 'lucide-react';
import type { Mode } from '@/types/database';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'الاستهلاك — ملاكي' };

type Totals = {
  messageCount: number;
  tokensInput: number;
  tokensOutput: number;
  costUsd: number;
};

const MODE_META: Record<Mode, { label: string; icon: typeof PenLine; gradient: string }> = {
  WRITER: { label: 'الكاتب', icon: PenLine, gradient: 'from-emerald-400 to-cyan-500' },
  CODER: { label: 'المبرمج', icon: Code2, gradient: 'from-violet-500 to-indigo-500' },
  DESIGNER: { label: 'المصمم', icon: Palette, gradient: 'from-pink-500 to-orange-500' },
};

function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

function formatCost(usd: number): string {
  if (usd === 0) return '$0.00';
  if (usd < 0.01) return '< $0.01';
  return `$${usd.toFixed(2)}`;
}

export default async function UsagePage() {
  const { user } = await requireAuthUser();
  const supabase = getServerClient();

  // Fetch all conversations with aggregated messages
  const { data: convs } = await supabase
    .from('conversations')
    .select('id, mode')
    .eq('user_id', user.id);

  const convsByMode = new Map<string, string[]>();
  (convs ?? []).forEach((c) => {
    const arr = convsByMode.get(c.mode) ?? [];
    arr.push(c.id);
    convsByMode.set(c.mode, arr);
  });

  // Fetch all assistant messages for this user's conversations
  const convIds = (convs ?? []).map((c) => c.id);
  const { data: messages } = convIds.length
    ? await supabase
        .from('messages')
        .select('conversation_id, tokens_input, tokens_output, cost_usd, role, created_at')
        .in('conversation_id', convIds)
        .eq('role', 'assistant')
    : { data: [] };

  // Rate limits for today
  const { data: rateLimits } = await supabase
    .from('rate_limits')
    .select('mode, count, reset_at')
    .eq('user_id', user.id);

  const totalsByMode = new Map<Mode, Totals>();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let totalMessagesToday = 0;

  (messages ?? []).forEach((m) => {
    const mode = (convs ?? []).find((c) => c.id === m.conversation_id)?.mode as Mode | undefined;
    if (!mode) return;
    const t = totalsByMode.get(mode) ?? {
      messageCount: 0,
      tokensInput: 0,
      tokensOutput: 0,
      costUsd: 0,
    };
    t.messageCount += 1;
    t.tokensInput += m.tokens_input ?? 0;
    t.tokensOutput += m.tokens_output ?? 0;
    t.costUsd += Number(m.cost_usd ?? 0);
    totalsByMode.set(mode, t);

    if (m.created_at && new Date(m.created_at).getTime() >= today.getTime()) {
      totalMessagesToday += 1;
    }
  });

  const grandTotal: Totals = { messageCount: 0, tokensInput: 0, tokensOutput: 0, costUsd: 0 };
  totalsByMode.forEach((t) => {
    grandTotal.messageCount += t.messageCount;
    grandTotal.tokensInput += t.tokensInput;
    grandTotal.tokensOutput += t.tokensOutput;
    grandTotal.costUsd += t.costUsd;
  });

  const modes: Mode[] = ['WRITER', 'CODER', 'DESIGNER'];

  return (
    <div className="p-6 sm:p-10">
      <header className="mb-8">
        <p className="font-latin text-[10px] uppercase tracking-[0.18em] text-ink-subtle">
          Usage
        </p>
        <h1 className="ds-display-ar mt-1 text-3xl font-bold">الاستهلاك</h1>
        <p className="mt-2 text-sm text-ink-muted">
          تتبّع رسائلك، التوكنز، والتكلفة عبر كل الأوضاع.
        </p>
      </header>

      {/* Top stats */}
      <div className="mb-10 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="رسائل الإجمالي"
          value={formatNumber(grandTotal.messageCount)}
          icon={<Sparkles className="h-4 w-4" />}
        />
        <StatCard
          label="رسائل اليوم"
          value={formatNumber(totalMessagesToday)}
          icon={<Gauge className="h-4 w-4" />}
        />
        <StatCard
          label="توكنز مولّدة"
          value={formatNumber(grandTotal.tokensOutput)}
          icon={<PenLine className="h-4 w-4" />}
        />
        <StatCard
          label="التكلفة التقديرية"
          value={formatCost(grandTotal.costUsd)}
          icon={<Code2 className="h-4 w-4" />}
          hint="تقدير بحسب أسعار النماذج"
        />
      </div>

      {/* Per-mode breakdown */}
      <h2 className="mb-4 text-lg font-semibold">حسب الوضع</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {modes.map((mode) => {
          const meta = MODE_META[mode];
          const t = totalsByMode.get(mode) ?? {
            messageCount: 0,
            tokensInput: 0,
            tokensOutput: 0,
            costUsd: 0,
          };
          const rl = rateLimits?.find((r) => r.mode === mode);
          const limit = DAILY_LIMITS[mode];
          const usedToday =
            rl && rl.reset_at && new Date(rl.reset_at).getTime() > Date.now() ? rl.count ?? 0 : 0;
          const pct = Math.min(100, Math.round((usedToday / limit) * 100));
          const Icon = meta.icon;
          return (
            <div
              key={mode}
              className="overflow-hidden rounded-2xl border border-border bg-white/[0.03] p-5 backdrop-blur-xl"
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${meta.gradient} text-white shadow-md`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-semibold">{meta.label}</p>
                  <p className="font-latin text-[10px] uppercase tracking-wider text-ink-subtle">
                    {mode.toLowerCase()}
                  </p>
                </div>
              </div>

              <dl className="space-y-2 text-sm">
                <Row label="رسائل" value={formatNumber(t.messageCount)} />
                <Row label="توكنز دخل" value={formatNumber(t.tokensInput)} />
                <Row label="توكنز خرج" value={formatNumber(t.tokensOutput)} />
                <Row label="التكلفة" value={formatCost(t.costUsd)} />
              </dl>

              <div className="mt-5 border-t border-border pt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="text-ink-subtle">استهلاك اليوم</span>
                  <span className="font-medium text-foreground">
                    {usedToday} / {limit}
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
                  <div
                    className={`h-full bg-gradient-to-l ${meta.gradient} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white/[0.03] p-4 backdrop-blur-xl">
      <div className="mb-2 flex items-center gap-2 text-xs text-ink-subtle">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/[0.04] text-violet-300">
          {icon}
        </span>
        <span>{label}</span>
      </div>
      <p className="font-latin text-2xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-[10px] text-ink-subtle">{hint}</p>}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-muted">{label}</span>
      <span className="font-latin font-medium">{value}</span>
    </div>
  );
}
