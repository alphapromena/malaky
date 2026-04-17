'use client';

import { useState, type ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sidebar } from './Sidebar';
import type { Mode } from '@/types/database';
import { cn } from '@/lib/utils';

export function AppShell({ mode, children }: { mode: Mode; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="grid h-screen grid-cols-1 md:grid-cols-[288px_1fr]">
      {/* Mobile toggle */}
      <div className="md:hidden sticky top-0 z-40 flex items-center gap-2 border-b bg-background/95 px-3 py-2 backdrop-blur">
        <Button variant="ghost" size="icon" onClick={() => setOpen((v) => !v)} aria-label="القائمة">
          {open ? <Menu className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <span className="font-bold">ملاكي</span>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          'hidden md:block',
          'md:static md:h-screen',
        )}
      >
        <Sidebar mode={mode} />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute end-0 top-0 h-full w-[88%] max-w-[320px] bg-background shadow-xl">
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
      <main className="flex h-[calc(100vh-0px)] min-w-0 flex-col bg-background md:h-screen">
        {children}
      </main>
    </div>
  );
}
