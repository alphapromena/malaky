'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MODES } from '@/lib/modes';
import { cn } from '@/lib/utils';

export function ModeSwitch() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-3 gap-1 rounded-xl border bg-muted/40 p-1">
      {MODES.map((m) => {
        const href = `/${m.slug}`;
        const active = pathname.startsWith(href);
        const Icon = m.icon;
        return (
          <Link
            key={m.slug}
            href={href}
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium transition-all',
              active
                ? 'bg-background text-primary shadow-sm ring-1 ring-border'
                : 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{m.nameAr.replace('ملاكي ', '')}</span>
          </Link>
        );
      })}
    </div>
  );
}
