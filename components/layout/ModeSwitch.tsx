'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MODES } from '@/lib/modes';
import { cn } from '@/lib/utils';

export function ModeSwitch() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-3 gap-1 rounded-xl border border-border bg-white/[0.02] p-1">
      {MODES.map((m) => {
        const href = `/${m.slug}`;
        const active = pathname.startsWith(href);
        const Icon = m.icon;
        return (
          <Link
            key={m.slug}
            href={href}
            className={cn(
              'relative flex flex-col items-center gap-1 rounded-lg px-2 py-2.5 text-xs font-medium transition-all duration-fast',
              active
                ? 'bg-white/[0.08] text-foreground shadow-sm'
                : 'text-ink-muted hover:bg-white/[0.04] hover:text-foreground',
            )}
          >
            <span
              className={cn(
                'relative flex h-6 w-6 items-center justify-center rounded-md',
                active && `bg-gradient-to-br ${m.accent} text-white`,
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <span className="text-[11px]">{m.nameAr}</span>
          </Link>
        );
      })}
    </div>
  );
}
