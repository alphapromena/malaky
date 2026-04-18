'use client';

import { useState, type ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from './Sidebar';
import type { Mode } from '@/types/database';

export function AppShell({ mode, children }: { mode: Mode; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid h-screen grid-cols-1 bg-paper-100 md:grid-cols-[300px_1fr]">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center gap-2 border-b border-border bg-paper-100/80 px-3 py-2 backdrop-blur-md md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="القائمة">
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-bold">ملاكي</span>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block md:h-screen">
        <Sidebar mode={mode} />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink-900/55" onClick={() => setOpen(false)} />
          <div className="absolute end-0 top-0 h-full w-[88%] max-w-[320px] bg-paper-100 shadow-xl">
            <div className="flex items-center justify-end p-2">
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="إغلاق">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="h-[calc(100%-3rem)]">
              <Sidebar mode={mode} />
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main className="flex min-w-0 flex-col md:h-screen">{children}</main>
    </div>
  );
}
