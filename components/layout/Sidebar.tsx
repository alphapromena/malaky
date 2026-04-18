'use client';

import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ModeSwitch } from './ModeSwitch';
import { ConversationList } from './ConversationList';
import { getModeConfigByMode } from '@/lib/modes';
import type { Mode } from '@/types/database';

export function Sidebar({ mode }: { mode: Mode }) {
  const cfg = getModeConfigByMode(mode);

  return (
    <aside className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-canvas-elevated/60 backdrop-blur-2xl">
      {/* Brand */}
      <div className="border-b border-border p-5">
        <Link href="/" className="mb-5 flex items-center gap-3" aria-label="ملاكي">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 shadow-glow">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <h2 className="text-lg font-bold text-foreground">ملاكي</h2>
            <p className="font-latin text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
              Malaky AI
            </p>
          </div>
        </Link>
        <ModeSwitch />
      </div>

      {/* New chat */}
      <div className="p-4">
        <Button asChild className="w-full gap-2" size="default">
          <Link href={`/${cfg.slug}`}>
            <Plus className="h-4 w-4" />
            محادثة جديدة
          </Link>
        </Button>
      </div>

      {/* Conversations */}
      <div className="px-5 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-subtle">
        المحادثات
      </div>
      <ScrollArea className="chat-scroll flex-1">
        <ConversationList mode={mode} slug={cfg.slug} />
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2 text-xs">
          <span className="text-ink-muted">الحد اليومي</span>
          <span className="font-medium text-foreground">
            {cfg.limit} <span className="text-ink-subtle">{cfg.limitUnit}</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
