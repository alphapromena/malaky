'use client';

import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';
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
    <aside className="flex h-full w-full flex-col border-l bg-card/50">
      <div className="border-b p-4">
        <Link href="/" className="mb-4 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold leading-none">ملاكي</h2>
            <p className="text-xs text-muted-foreground">Malaky AI</p>
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

      <div className="px-3 pb-1 pt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {cfg.nameAr}
      </div>

      <ScrollArea className="flex-1 chat-scroll">
        <ConversationList mode={mode} slug={cfg.slug} />
      </ScrollArea>

      <Separator />
      <div className="p-3 text-[11px] text-muted-foreground">
        الحد اليومي: {cfg.limit} {cfg.limitUnit}
      </div>
    </aside>
  );
}
