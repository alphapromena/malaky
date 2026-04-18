import type { ReactNode } from 'react';
import { SettingsNav } from '@/components/settings/SettingsNav';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-canvas-base">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 gap-6 px-4 py-8 md:grid-cols-[260px_1fr] md:px-6 md:py-10">
        <aside className="md:sticky md:top-10 md:h-fit">
          <SettingsNav />
        </aside>
        <main className="min-w-0 rounded-3xl border border-border bg-canvas-elevated/40 backdrop-blur-2xl">
          {children}
        </main>
      </div>
    </div>
  );
}
