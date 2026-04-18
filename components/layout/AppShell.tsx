'use client';

import { useState, type ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from './Sidebar';
import type { Mode } from '@/types/database';

export function AppShell({ mode, children }: { mode: Mode; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative h-screen overflow-hidden bg-canvas-base">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center gap-2 border-b border-border bg-canvas-base/70 px-3 py-2 backdrop-blur-xl md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="القائمة">
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-bold">ملاكي</span>
      </div>

      {/* Layout grid */}
      <div className="grid h-[calc(100vh-0px)] md:grid-cols-[320px_1fr] md:gap-4 md:p-4">
        {/* Desktop sidebar — floating, rounded, glass */}
        <div className="hidden md:block md:h-[calc(100vh-2rem)]">
          <Sidebar mode={mode} />
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div className="absolute end-3 top-3 bottom-3 w-[88%] max-w-[320px] animate-scale-in">
              <div className="flex items-center justify-end p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                  aria-label="إغلاق"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="h-[calc(100%-3rem)]">
                <Sidebar mode={mode} />
              </div>
            </div>
          </div>
        )}

        {/* Main surface */}
        <main className="flex min-w-0 flex-col overflow-hidden md:h-[calc(100vh-2rem)] md:rounded-2xl md:border md:border-border md:bg-canvas-elevated/40 md:backdrop-blur-2xl">
          {children}
        </main>
      </div>
    </div>
  );
}
