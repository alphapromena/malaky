'use client';

import { User } from 'lucide-react';
import { Markdown } from './Markdown';
import { WingsLogo } from '@/components/brand/WingsLogo';
import { cn } from '@/lib/utils';

export type UiMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  streaming?: boolean;
};

export function MessageList({ messages }: { messages: UiMessage[] }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <ul className="space-y-7">
        {messages.map((m) => (
          <li key={m.id} className="flex gap-3 animate-fade-in">
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm',
                m.role === 'user'
                  ? 'border border-border bg-white/[0.06] text-foreground'
                  : 'bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 text-canvas-base shadow-glow',
              )}
            >
              {m.role === 'user' ? (
                <User className="h-4 w-4" />
              ) : (
                <WingsLogo size={18} tone="solid" className="text-canvas-base" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center gap-2 text-[11px] font-medium">
                <span
                  className={cn(
                    m.role === 'user' ? 'text-ink-muted' : 'text-gradient-brand font-semibold',
                  )}
                >
                  {m.role === 'user' ? 'أنت' : 'ملاكي'}
                </span>
              </div>
              <div
                dir="auto"
                className={cn(
                  'rounded-2xl px-5 py-4 text-sm leading-[1.85]',
                  m.role === 'user'
                    ? 'border border-border bg-white/[0.03]'
                    : 'border border-gold-400/20 bg-gradient-to-br from-gold-400/[0.06] to-gold-600/[0.04] shadow-sm',
                  m.streaming && 'streaming-cursor',
                )}
              >
                {m.role === 'user' ? (
                  <p className="whitespace-pre-wrap" dir="auto">
                    {m.content}
                  </p>
                ) : (
                  <Markdown>{m.content}</Markdown>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
