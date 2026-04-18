import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import type { Mode } from '@/types/database';

export async function AppShell({ mode, children }: { mode: Mode; children: ReactNode }) {
  const sidebar = await Sidebar({ mode });

  return (
    <div className="relative h-screen overflow-hidden bg-canvas-base">
      <MobileNav sidebar={sidebar} />

      <div className="grid h-[calc(100vh-0px)] md:grid-cols-[320px_1fr] md:gap-4 md:p-4">
        <div className="hidden md:block md:h-[calc(100vh-2rem)]">{sidebar}</div>

        <main className="flex min-w-0 flex-col overflow-hidden md:h-[calc(100vh-2rem)] md:rounded-2xl md:border md:border-border md:bg-canvas-elevated/40 md:backdrop-blur-2xl">
          {children}
        </main>
      </div>
    </div>
  );
}
