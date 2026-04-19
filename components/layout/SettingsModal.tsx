'use client';

import { useEffect, useState } from 'react';
import {
  BarChart2,
  Check,
  Code2,
  Copy,
  CreditCard,
  HelpCircle,
  Key,
  LifeBuoy,
  Link2,
  Loader2,
  LogOut,
  Search,
  Settings,
  Settings2,
  Trash2,
  User as UserIcon,
  Users,
  X,
} from 'lucide-react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Mode } from '@/types/database';

type Section =
  | 'preferences'
  | 'account'
  | 'usage'
  | 'billing'
  | 'api'
  | 'team'
  | 'integrations';

const NAV_ITEMS: Array<{ id: Section; label: string; icon: typeof Settings2 }> = [
  { id: 'preferences',  label: 'التفضيلات',  icon: Settings2 },
  { id: 'account',      label: 'الحساب',     icon: UserIcon },
  { id: 'usage',        label: 'الاستهلاك',  icon: BarChart2 },
  { id: 'billing',      label: 'الفوترة',    icon: CreditCard },
  { id: 'api',          label: 'API',        icon: Code2 },
  { id: 'team',         label: 'الفريق',     icon: Users },
  { id: 'integrations', label: 'التكاملات',  icon: Link2 },
];

export function SettingsModal({
  firstName,
  lastName,
  email,
  avatarUrl,
}: {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Section>('preferences');
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const fullName = `${firstName} ${lastName}`.trim();

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl"
          aria-label="الإعدادات"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogPrimitive.Trigger>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            'fixed start-[50%] top-[50%] z-50 w-[calc(100vw-2rem)] max-w-[860px] h-[calc(100vh-2rem)] max-h-[548px]',
            'translate-x-[50%] translate-y-[-50%]',
            'overflow-hidden rounded-2xl border border-border bg-canvas-elevated/95 backdrop-blur-2xl shadow-xl',
            'data-[state=open]:animate-scale-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          )}
          dir="rtl"
        >
          <DialogPrimitive.Title className="sr-only">الإعدادات</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            إدارة التفضيلات، الحساب، التكاملات، والمزيد.
          </DialogPrimitive.Description>

          <DialogPrimitive.Close
            className="absolute end-3 top-3 z-10 rounded-lg p-1.5 text-ink-muted transition-colors hover:bg-white/10 hover:text-foreground focus:outline-none"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>

          <div className="flex h-full min-h-0">
            {/* Right-side nav (inline-start in RTL) */}
            <nav className="flex w-52 shrink-0 flex-col border-s border-border bg-canvas-raised/40 p-3">
              {/* User chip */}
              <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-border bg-white/[0.02] p-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 text-xs font-semibold text-canvas-base">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="truncate text-xs font-medium">{fullName}</p>
                  <p
                    className="truncate font-latin text-[10px] text-ink-subtle"
                    dir="ltr"
                    title={email}
                  >
                    {email}
                  </p>
                </div>
              </div>

              {/* Nav items */}
              <ul className="flex-1 space-y-0.5">
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                  const isActive = active === id;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => setActive(id)}
                        className={cn(
                          'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors',
                          isActive
                            ? 'bg-gold-400/10 text-gold-300'
                            : 'text-ink-muted hover:bg-white/[0.04] hover:text-foreground',
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Help */}
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-ink-muted transition-colors hover:bg-white/[0.04] hover:text-foreground"
              >
                <HelpCircle className="h-4 w-4 shrink-0" />
                <span>المساعدة</span>
              </button>
            </nav>

            {/* Left-side content (inline-end in RTL) */}
            <div className="flex-1 overflow-y-auto chat-scroll">
              <div className="p-7 sm:p-8">
                {active === 'preferences' && <PreferencesPanel />}
                {active === 'account' && (
                  <AccountPanel
                    fullName={fullName}
                    email={email}
                    initials={initials}
                    avatarUrl={avatarUrl ?? null}
                  />
                )}
                {active === 'usage' && <UsagePanel />}
                {active === 'billing' && <BillingPanel />}
                {active === 'api' && <ApiPanel />}
                {active === 'team' && <TeamPanel />}
                {active === 'integrations' && <IntegrationsPanel />}
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ============================================================================
// Panels
// ============================================================================

function PanelHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-6">
      <h2 className="ds-display text-2xl font-bold">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>}
    </header>
  );
}

function FieldRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 border-b border-border py-4 last:border-0 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1 pe-4">
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="mt-1 text-xs text-ink-subtle">{hint}</p>}
      </div>
      <div className="w-full sm:max-w-xs">{children}</div>
    </div>
  );
}

// ---- Preferences ----------------------------------------------------------
function PreferencesPanel() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('dark');
  const [emailNotif, setEmailNotif] = useState(true);
  const [productNotif, setProductNotif] = useState(false);

  return (
    <div>
      <PanelHeader title="التفضيلات" subtitle="خصّص تجربتك في ملاكي." />

      <section>
        <FieldRow label="اللغة" hint="لغة واجهة المنصّة.">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'ar' | 'en')}
            className="flex h-10 w-full rounded-xl border border-border bg-white/[0.03] px-3 text-sm text-foreground focus:border-gold-400/50 focus:outline-none"
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>
        </FieldRow>

        <FieldRow label="المظهر" hint="الثيم الافتراضي للمنصّة.">
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'light', label: 'فاتح' },
                { id: 'dark',  label: 'داكن' },
                { id: 'auto',  label: 'تلقائي' },
              ] as const
            ).map((t) => {
              const isActive = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-lg border p-2 text-[11px] transition-colors',
                    isActive
                      ? 'border-gold-400/50 bg-gold-400/10 text-gold-200'
                      : 'border-border bg-white/[0.02] text-ink-muted hover:bg-white/[0.04]',
                  )}
                >
                  <ThemePreview variant={t.id} active={isActive} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </FieldRow>

        <FieldRow
          label="إشعارات البريد"
          hint="رسائل ترحيب، تنبيهات مهمة، تحديثات أمان."
        >
          <Toggle checked={emailNotif} onChange={setEmailNotif} />
        </FieldRow>

        <FieldRow label="إشعارات المنتج" hint="ميزات جديدة ونشرات دورية.">
          <Toggle checked={productNotif} onChange={setProductNotif} />
        </FieldRow>
      </section>
    </div>
  );
}

function ThemePreview({
  variant,
  active,
}: {
  variant: 'light' | 'dark' | 'auto';
  active: boolean;
}) {
  const isLight = variant === 'light';
  const isAuto = variant === 'auto';
  return (
    <div
      className={cn(
        'h-8 w-full overflow-hidden rounded-md border',
        active ? 'border-gold-400/60' : 'border-border',
      )}
    >
      {isAuto ? (
        <div className="flex h-full">
          <div className="h-full flex-1 bg-[#0B0906]" />
          <div className="h-full flex-1 bg-[#F5EEE0]" />
        </div>
      ) : (
        <div className={cn('h-full w-full', isLight ? 'bg-[#F5EEE0]' : 'bg-[#0B0906]')}>
          <div
            className={cn(
              'm-1 h-1.5 w-4 rounded-sm',
              isLight ? 'bg-ink-inverse/30' : 'bg-white/25',
            )}
          />
        </div>
      )}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors',
        checked ? 'bg-gold-400' : 'bg-white/10',
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform',
          checked ? '-translate-x-0.5' : '-translate-x-[1.25rem]',
        )}
      />
    </button>
  );
}

// ---- Account --------------------------------------------------------------
function AccountPanel({
  fullName,
  email,
  initials,
  avatarUrl,
}: {
  fullName: string;
  email: string;
  initials: string;
  avatarUrl: string | null;
}) {
  return (
    <div>
      <PanelHeader title="الحساب" subtitle="معلومات حسابك وإجراءات الأمان." />

      <section className="rounded-2xl border border-border bg-white/[0.02] p-5">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 text-base font-semibold text-canvas-base shadow-sm">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold">{fullName}</p>
            <p className="truncate font-latin text-xs text-ink-subtle" dir="ltr">
              {email}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 space-y-3">
        <form action="/api/auth/logout" method="post">
          <Button type="submit" variant="outline" className="w-full justify-between">
            <span>تسجيل الخروج</span>
            <LogOut className="h-4 w-4" />
          </Button>
        </form>

        <div className="rounded-2xl border border-danger/30 bg-danger/[0.04] p-5">
          <div className="mb-3">
            <p className="text-sm font-semibold text-danger">حذف الحساب</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-muted">
              يحذف كل محادثاتك وصورك وإعداداتك بشكل دائم. لا يمكن التراجع.
            </p>
          </div>
          <Button variant="destructive" size="sm" className="gap-2" asChild>
            <a href="/settings/account">
              <Trash2 className="h-4 w-4" />
              المتابعة لحذف الحساب
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}

// ---- Usage ----------------------------------------------------------------
type UsagePayload = Record<Mode, { used: number; limit: number; resetAt: string | null }>;

const MODE_LABELS: Record<Mode, string> = {
  WRITER: 'الكاتب',
  CODER: 'المبرمج',
  DESIGNER: 'المصمم',
};

function UsagePanel() {
  const [data, setData] = useState<UsagePayload | null>(null);

  useEffect(() => {
    let ignore = false;
    fetch('/api/settings/usage')
      .then((r) => r.json())
      .then((j: { usage?: UsagePayload }) => {
        if (!ignore && j.usage) setData(j.usage);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div>
      <PanelHeader
        title="الاستهلاك اليومي"
        subtitle="الرسائل المتبقية اليوم لكل وضع، وتُعاد كل ٢٤ ساعة."
      />

      <section className="space-y-4">
        {(['WRITER', 'CODER', 'DESIGNER'] as Mode[]).map((mode) => {
          const row = data?.[mode];
          const used = row?.used ?? 0;
          const limit = row?.limit ?? 0;
          const pct = limit ? Math.min(100, Math.round((used / limit) * 100)) : 0;
          return (
            <div
              key={mode}
              className="rounded-2xl border border-border bg-white/[0.02] p-5"
            >
              <div className="mb-3 flex items-baseline justify-between">
                <p className="text-sm font-semibold">{MODE_LABELS[mode]}</p>
                <p className="font-latin text-xs text-ink-muted">
                  <span className="text-foreground">{used}</span>
                  <span className="text-ink-subtle"> / {limit}</span>
                </p>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                <div
                  className="h-full bg-gradient-to-l from-gold-300 to-gold-600 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
        {!data && (
          <p className="flex items-center justify-center gap-2 py-4 text-xs text-ink-subtle">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            جاري تحميل الاستهلاك…
          </p>
        )}
      </section>
    </div>
  );
}

// ---- Billing --------------------------------------------------------------
function BillingPanel() {
  return (
    <div>
      <PanelHeader title="الفوترة" subtitle="خطتك الحالية وإعدادات الدفع." />
      <section className="rounded-2xl border border-border bg-white/[0.02] p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-latin text-[10px] uppercase tracking-[0.18em] text-ink-subtle">
              Current plan
            </p>
            <p className="mt-1 text-lg font-semibold">الخطّة المجانية</p>
            <p className="mt-1 text-xs text-ink-muted">
              حدود يومية ثابتة. للحصول على حدود أعلى ونماذج إضافية، رقّي لـ Pro.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-border bg-white/[0.03] px-2.5 py-0.5 font-latin text-[10px] uppercase tracking-wider text-ink-subtle">
            FREE
          </span>
        </div>
        <Button className="mt-5 w-full" size="lg" disabled>
          الترقية إلى Pro — قريباً
        </Button>
      </section>
    </div>
  );
}

// ---- API ------------------------------------------------------------------
function ApiPanel() {
  const [copied, setCopied] = useState(false);
  const fakeKey = 'mlk_live_' + '•'.repeat(32) + 'xyz9';

  async function copy() {
    try {
      await navigator.clipboard.writeText(fakeKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div>
      <PanelHeader
        title="وصول API"
        subtitle="أنشئ مفاتيح لدمج ملاكي في تطبيقاتك. (قريباً)"
      />

      <section className="space-y-3">
        <div className="rounded-2xl border border-border bg-white/[0.02] p-4">
          <div className="mb-2 flex items-center gap-2">
            <Key className="h-4 w-4 text-ink-subtle" />
            <p className="text-sm font-medium">مفتاحك الافتراضي</p>
            <span className="ms-auto rounded-full border border-border bg-white/[0.03] px-2 py-0.5 font-latin text-[9px] uppercase tracking-wider text-ink-subtle">
              قريباً
            </span>
          </div>
          <div className="flex items-center gap-2">
            <code
              dir="ltr"
              className="flex-1 overflow-hidden rounded-lg border border-border bg-canvas-raised px-3 py-2 font-mono text-xs text-ink-muted"
            >
              {fakeKey}
            </code>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={copy}
              className="h-10 w-10 shrink-0"
              aria-label="نسخ المفتاح"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button className="w-full" disabled>
          إنشاء مفتاح جديد — قريباً
        </Button>
      </section>
    </div>
  );
}

// ---- Team -----------------------------------------------------------------
function TeamPanel() {
  return (
    <div>
      <PanelHeader title="الفريق" subtitle="ادعُ زملاءك لمشاركة المساحة." />
      <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white/[0.02] p-10 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-300/25 to-gold-600/25 text-gold-200">
          <Users className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold">لم تُضِف أعضاء بعد</p>
        <p className="mt-1 max-w-xs text-xs text-ink-muted">
          الميزات التعاونية ستُفتح مع خطة Team قريباً. ادعُ زميلاً ليبدأ معك لما
          نُطلقها.
        </p>
        <Button className="mt-5" disabled>
          دعوة أعضاء — قريباً
        </Button>
      </section>
    </div>
  );
}

// ---- Integrations ---------------------------------------------------------
type Connector = {
  id: string;
  name: string;
  description: string;
  iconBg: string;
  iconLetter: string;
  defaultConnected?: boolean;
};

const CONNECTORS: Connector[] = [
  { id: 'web-search',    name: 'بحث الويب',     description: 'بحث حيّ أثناء الرد.',                   iconBg: 'bg-[#3B82F6]', iconLetter: 'W', defaultConnected: true },
  { id: 'wikipedia',     name: 'ويكيبيديا',     description: 'موسوعة عربية للمعرفة الدقيقة.',         iconBg: 'bg-[#6B7280]', iconLetter: 'و' },
  { id: 'arxiv',         name: 'Arxiv',         description: 'أوراق بحثية علمية ومراجع.',             iconBg: 'bg-[#D97706]', iconLetter: 'X' },
  { id: 'github',        name: 'GitHub',        description: 'يقرأ ويُحرّر الريبوز، يفتح PRs.',       iconBg: 'bg-[#24292E]', iconLetter: 'G', defaultConnected: true },
  { id: 'supabase',      name: 'Supabase',      description: 'استعلامات SQL وقراءة الجداول.',         iconBg: 'bg-[#10B981]', iconLetter: 'S', defaultConnected: true },
  { id: 'vercel',        name: 'Vercel',        description: 'إدارة الـ deployments والمشاريع.',     iconBg: 'bg-[#0A0A0A]', iconLetter: 'V', defaultConnected: true },
  { id: 'gmail',         name: 'Gmail',         description: 'إرسال بريد من المحادثة.',             iconBg: 'bg-[#DB4437]', iconLetter: 'M' },
  { id: 'notion',        name: 'Notion',        description: 'حفظ المحادثات كصفحات Notion.',          iconBg: 'bg-[#2F2F2F]', iconLetter: 'N' },
  { id: 'slack',         name: 'Slack',         description: 'ربط ملاكي بقنوات العمل.',               iconBg: 'bg-[#6B46C1]', iconLetter: '#' },
  { id: 'google-drive',  name: 'Google Drive',  description: 'رفع وتخزين الملفات المولّدة.',         iconBg: 'bg-[#1E88E5]', iconLetter: 'D' },
];

type IntegrationTab = 'apps' | 'api' | 'mcp';

function IntegrationsPanel() {
  const [tab, setTab] = useState<IntegrationTab>('apps');
  const [query, setQuery] = useState('');
  const [connected, setConnected] = useState<Set<string>>(
    () => new Set(CONNECTORS.filter((c) => c.defaultConnected).map((c) => c.id)),
  );

  function toggle(id: string) {
    setConnected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const filtered = CONNECTORS.filter((c) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

  const total = CONNECTORS.length;
  const connectedCount = connected.size;

  return (
    <div>
      <PanelHeader
        title="التكاملات"
        subtitle={`${connectedCount} متصل من أصل ${total} متاح.`}
      />

      {/* Tabs */}
      <div className="mb-4 inline-flex gap-1 rounded-xl border border-border bg-canvas-raised/40 p-1">
        {(
          [
            { id: 'apps', label: 'التطبيقات' },
            { id: 'api',  label: 'API مخصص' },
            { id: 'mcp',  label: 'MCP مخصص' },
          ] as const
        ).map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors',
                isActive
                  ? 'bg-gold-400/15 text-gold-200 shadow-sm'
                  : 'text-ink-muted hover:text-foreground',
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === 'apps' && (
        <>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن تكامل…"
              className="h-10 pe-10"
            />
          </div>

          {/* Grid */}
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {filtered.map((c) => {
              const isConnected = connected.has(c.id);
              return (
                <li
                  key={c.id}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3 transition-colors hover:bg-card/70"
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-white',
                      c.iconBg,
                    )}
                    aria-hidden
                  >
                    {c.iconLetter}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium leading-tight">
                      {c.name}
                    </p>
                    <p className="truncate text-[11px] text-ink-muted">
                      {c.description}
                    </p>
                  </div>
                  <ConnectorStatusButton
                    connected={isConnected}
                    onClick={() => toggle(c.id)}
                  />
                </li>
              );
            })}
            {filtered.length === 0 && (
              <li className="col-span-full rounded-xl border border-dashed border-border bg-white/[0.02] p-6 text-center text-xs text-ink-subtle">
                لا يوجد تكامل مطابق للبحث.
              </li>
            )}
          </ul>
        </>
      )}

      {tab === 'api' && (
        <div className="rounded-xl border border-dashed border-border bg-white/[0.02] p-10 text-center">
          <LifeBuoy className="mx-auto mb-3 h-5 w-5 text-ink-subtle" />
          <p className="text-sm font-medium">API مخصص</p>
          <p className="mt-1 text-xs text-ink-muted">
            أضف endpoint خاص فيك وربطه بملاكي عبر OpenAPI. قريباً.
          </p>
        </div>
      )}

      {tab === 'mcp' && (
        <div className="rounded-xl border border-dashed border-border bg-white/[0.02] p-10 text-center">
          <LifeBuoy className="mx-auto mb-3 h-5 w-5 text-ink-subtle" />
          <p className="text-sm font-medium">MCP مخصص</p>
          <p className="mt-1 text-xs text-ink-muted">
            اربط خادم MCP خاص (filesystem، git، قواعد بيانات). قريباً.
          </p>
        </div>
      )}
    </div>
  );
}

function ConnectorStatusButton({
  connected,
  onClick,
}: {
  connected: boolean;
  onClick: () => void;
}) {
  if (connected) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex shrink-0 items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 transition-colors hover:border-danger/40 hover:bg-danger/10 hover:text-danger"
      >
        <Check className="h-3 w-3" />
        متصل
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="shrink-0 rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-[11px] font-semibold text-gold-200 transition-colors hover:bg-gold-400/20"
    >
      ربط
    </button>
  );
}
