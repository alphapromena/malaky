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
    <div className="mx-auto w-full max-w-3xl px-3 py-6 sm:px-6">
      <ul className="space-y-6">
        {messages.map((m) => (
          <li key={m.id} className="flex gap-3 animate-fade-in">
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                m.role === 'user'
                  ? 'bg-ink-900 text-paper-50'
                  : 'bg-gold-400 text-ink-900',
              )}
            >
              {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 text-xs font-medium text-fg-subtle">
                {m.role === 'user' ? 'أنت' : 'ملاكي'}
              </div>
              <div
                className={cn(
                  'rounded-xl border px-4 py-3 text-sm leading-relaxed',
                  m.role === 'user'
                    ? 'border-ink-900/10 bg-ink-900/[0.04]'
                    : 'border-border bg-paper-50 shadow-sm',
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
