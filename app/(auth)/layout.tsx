import type { ReactNode } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-canvas-base">
      <div className="aurora" />
      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 shadow-glow">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold">ملاكي</p>
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
