'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ModeSwitch } from './ModeSwitch';
import { ConversationList } from './ConversationList';
import { getModeConfigByMode } from '@/lib/modes';
import type { Mode } from '@/types/database';

export function Sidebar({ mode }: { mode: Mode }) {
  const cfg = getModeConfigByMode(mode);

  return (
    <aside className="flex h-full w-full flex-col border-l border-border bg-paper-100/80 backdrop-blur-md">
      <div className="border-b border-border p-4">
        <Link href="/" className="mb-4 flex items-center gap-3" aria-label="ملاكي">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-900 text-gold-400 shadow-sm">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
            </svg>
          </div>
          <div className="leading-tight">
            <h2 className="text-lg font-bold text-foreground">ملاكي</h2>
            <p className="ds-meta">Malaky AI</p>
          </div>
        </Link>
        <ModeSwitch />
      </div>

      <div className="p-3">
        <Button asChild className="w-full gap-2" size="sm">
          <Link href={`/${cfg.slug}`}>
            <Plus className="h-4 w-4" />
            محادثة جديدة
          </Link>
        </Button>
      </div>

      <Separator />

      <div className="px-4 pb-1 pt-3 ds-meta">{cfg.nameAr}</div>

      <ScrollArea className="chat-scroll flex-1">
        <ConversationList mode={mode} slug={cfg.slug} />
      </ScrollArea>

      <Separator />
      <div className="p-3 text-xs text-fg-subtle">
        الحد اليومي: <span className="text-fg-muted">{cfg.limit}</span> {cfg.limitUnit}
      </div>
    </aside>
  );
}
