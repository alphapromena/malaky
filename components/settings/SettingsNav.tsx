'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  CreditCard,
  Gauge,
  Key,
  PlugZap,
  Shield,
  User as UserIcon,
  Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type Item = {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

const ITEMS: Item[] = [
  { href: '/settings/profile', label: 'التفضيلات', icon: UserIcon },
  { href: '/settings/account', label: 'الحساب', icon: Shield },
  { href: '/settings/usage', label: 'الاستهلاك', icon: Gauge },
  { href: '/settings/billing', label: 'الفوترة', icon: CreditCard, badge: 'قريباً' },
  { href: '/settings/api', label: 'API', icon: Key, badge: 'قريباً' },
  { href: '/settings/team', label: 'الفريق', icon: Users, badge: 'قريباً' },
  { href: '/settings/integrations', label: 'التكاملات', icon: PlugZap, badge: 'قريباً' },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-6">
      <Link
        href="/writer"
        className="flex items-center gap-2 text-sm text-ink-muted hover:text-foreground transition-colors"
      >
        <ArrowRight className="h-4 w-4" />
        العودة للمحادثة
      </Link>

      <div>
        <p className="mb-2 ps-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
          الإعدادات
        </p>
        <ul className="space-y-1">
          {ITEMS.map(({ href, label, icon: Icon, badge }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors',
                    active
                      ? 'border-violet-500/30 bg-violet-500/10 text-foreground'
                      : 'border-transparent text-ink-muted hover:bg-white/[0.04] hover:text-foreground',
                  )}
                >
                  <Icon
                    className={cn('h-4 w-4 shrink-0', active ? 'text-violet-300' : 'text-ink-subtle')}
                  />
                  <span className="flex-1">{label}</span>
                  {badge && (
                    <span className="rounded-full border border-border bg-white/[0.03] px-2 py-0.5 font-latin text-[9px] uppercase tracking-wider text-ink-subtle">
                      {badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
