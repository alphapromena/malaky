'use client';

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
      <ul className="space-y-8">
        {messages.map((m) => (
          <li key={m.id} className="animate-fade-in">
            <div className="mb-2 flex items-center gap-2">
              <div
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
                  m.role === 'user'
                    ? 'bg-white/[0.06] text-ink-muted'
                    : 'bg-gradient-to-br from-gold-300 via-gold-400 to-gold-600 text-canvas-base',
                )}
              >
                {m.role === 'user' ? (
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor" aria-hidden>
                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0 2c-3 0-8 1.5-8 5v1h16v-1c0-3.5-5-5-8-5z" />
                  </svg>
                ) : (
                  <WingsLogo size={12} tone="solid" className="text-canvas-base" />
                )}
              </div>
              <span
                className={cn(
                  'text-[11px]',
                  m.role === 'user'
                    ? 'text-ink-muted'
                    : 'text-gradient-brand font-semibold',
                )}
              >
                {m.role === 'user' ? 'أنت' : 'ملاكي'}
              </span>
            </div>

            {/* Conversational bubble — no visible border, soft tinted fill, pill radius */}
            <div
              dir="auto"
              className={cn(
                'rounded-3xl px-5 py-3.5 text-[15px] leading-[1.85]',
                m.role === 'user'
                  ? 'bg-white/[0.04]'
                  : 'bg-gold-400/[0.06]',
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
          </li>
        ))}
      </ul>
    </div>
  );
}
