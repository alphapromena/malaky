'use client';

import { Bot, User } from 'lucide-react';
import { Markdown } from './Markdown';
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
                  ? 'bg-white/[0.06] text-foreground border border-border'
                  : 'bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 text-white shadow-glow',
              )}
            >
              {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center gap-2 text-[11px] font-medium">
                <span className={cn(m.role === 'user' ? 'text-ink-muted' : 'text-gradient-accent font-semibold')}>
                  {m.role === 'user' ? 'أنت' : 'ملاكي'}
                </span>
              </div>
              <div
                className={cn(
                  'rounded-2xl px-5 py-4 text-sm leading-[1.8]',
                  m.role === 'user'
                    ? 'border border-border bg-white/[0.03]'
                    : 'border border-violet-500/15 bg-gradient-to-br from-violet-500/[0.06] to-pink-500/[0.04] shadow-sm',
                  m.streaming && 'streaming-cursor',
                )}
              >
                {m.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{m.content}</p>
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
