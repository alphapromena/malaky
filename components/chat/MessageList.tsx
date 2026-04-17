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
          <li key={m.id} className="flex gap-3">
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                m.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-accent-foreground',
              )}
            >
              {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div className="min-w-0 flex-1 animate-fade-in">
              <div className="mb-1 text-xs font-medium text-muted-foreground">
                {m.role === 'user' ? 'أنت' : 'ملاكي'}
              </div>
              <div
                className={cn(
                  'rounded-xl border bg-card p-3 text-sm',
                  m.role === 'user' && 'border-primary/20 bg-primary/5',
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
