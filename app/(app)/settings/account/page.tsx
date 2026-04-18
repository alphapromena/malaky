import Link from 'next/link';
import { Calendar, LogOut, Mail, ShieldCheck } from 'lucide-react';
import { requireAuthUser } from '@/lib/auth';
import { DangerZone } from '@/components/settings/DangerZone';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'الحساب — ملاكي' };

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default async function AccountPage() {
  const { user, profile } = await requireAuthUser();

  const rows: Array<{ icon: React.ReactNode; label: string; value: string; note?: string }> = [
    {
      icon: <Mail className="h-4 w-4" />,
      label: 'البريد الإلكتروني',
      value: user.email ?? '—',
      note: 'يستخدم لتسجيل الدخول',
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: 'تاريخ الانضمام',
      value: formatDate(profile!.created_at),
    },
    {
      icon: <ShieldCheck className="h-4 w-4" />,
      label: 'الموافقة على الشروط',
      value: formatDate(profile!.terms_accepted_at),
    },
  ];

  return (
    <div className="p-6 sm:p-10">
      <header className="mb-8">
        <p className="font-latin text-[10px] uppercase tracking-[0.18em] text-ink-subtle">Account</p>
        <h1 className="ds-display mt-1 text-3xl font-bold">الحساب</h1>
        <p className="mt-2 text-sm text-ink-muted">معلومات أساسية عن حسابك وخيارات الأمان.</p>
      </header>

      <section className="space-y-4">
        <div className="overflow-hidden rounded-2xl border border-border bg-white/[0.02]">
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.label} className="flex items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-ink-subtle">
                    {r.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{r.label}</p>
                    {r.note && <p className="text-xs text-ink-subtle">{r.note}</p>}
                  </div>
                </div>
                <p
                  className="truncate text-sm text-ink-muted font-latin"
                  dir={r.label === 'البريد الإلكتروني' ? 'ltr' : 'auto'}
                >
                  {r.value}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white/[0.02] p-5">
          <div>
            <p className="text-sm font-medium">تسجيل الخروج</p>
            <p className="text-xs text-ink-muted">إنهاء جلستك على هذا الجهاز.</p>
          </div>
          <form action="/api/auth/logout" method="post">
            <Button type="submit" variant="outline" size="sm" className="gap-2">
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </Button>
          </form>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white/[0.02] p-5">
          <div>
            <p className="text-sm font-medium">تغيير كلمة السر</p>
            <p className="text-xs text-ink-muted">قريباً — حالياً يمكنك طلب إعادة تعيين.</p>
          </div>
          <Button asChild variant="ghost" size="sm" disabled>
            <Link href="#" aria-disabled>
              قريباً
            </Link>
          </Button>
        </div>
      </section>

      <div className="mt-10">
        <DangerZone firstName={profile!.first_name} />
      </div>
    </div>
  );
}
