import type { ReactNode } from 'react';
import Link from 'next/link';
import { WingsLogo } from '@/components/brand/WingsLogo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-canvas-base">
      <div className="aurora" />
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <WingsLogo size={18} />
          <div className="leading-tight">
            <p className="ds-wordmark text-base">ملاكي</p>
            <p className="font-latin text-[9px] uppercase tracking-[0.2em] text-ink-subtle">
              Malaky AI
            </p>
          </div>
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center p-4 pb-16">
        {children}
      </main>
    </div>
  );
}
