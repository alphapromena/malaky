'use client';

import { useState, type ReactNode } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MobileNav({ sidebar }: { sidebar: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar (mobile only) */}
      <div className="sticky top-0 z-40 flex items-center gap-2 border-b border-border bg-canvas-base/70 px-3 py-2 backdrop-blur-xl md:hidden">
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="القائمة">
          <Menu className="h-5 w-5" />
        </Button>
        <span className="font-bold">ملاكي</span>
      </div>

      {/* Drawer */}
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
            <div className="h-[calc(100%-3rem)]">{sidebar}</div>
          </div>
        </div>
      )}
    </>
  );
}
