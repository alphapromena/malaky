'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export function ChatInput({
  placeholder,
  disabled,
  onSubmit,
  submitting,
  helperText,
}: {
  placeholder: string;
  disabled?: boolean;
  onSubmit: (text: string) => void | Promise<void>;
  submitting: boolean;
  helperText?: string;
}) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      fire();
    }
  }

  function fire() {
    const trimmed = value.trim();
    if (!trimmed || submitting) return;
    onSubmit(trimmed);
    setValue('');
    ref.current?.focus();
  }

  return (
    <div className="border-t border-border bg-canvas-elevated/40 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-3xl p-3 sm:p-5">
        <div
          className={cn(
            'group relative flex items-end gap-2 rounded-2xl border border-border bg-white/[0.04] p-2.5 transition-all duration-normal ease-out',
            'focus-within:border-violet-500/40 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_0_4px_rgba(139,92,246,0.15)]',
            disabled && 'opacity-60',
          )}
        >
          <Sparkles className="ms-1 mt-2.5 h-4 w-4 shrink-0 text-violet-400/70 transition-colors group-focus-within:text-violet-400" />
          <Textarea
            ref={ref}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder={placeholder}
            className="min-h-[44px] max-h-[200px] resize-none border-0 bg-transparent px-1 py-2 shadow-none focus:shadow-none focus:border-0 focus:ring-0"
            rows={1}
            disabled={disabled || submitting}
            dir="auto"
          />
          <Button
            onClick={fire}
            disabled={!value.trim() || submitting || disabled}
            size="icon"
            className="h-10 w-10 shrink-0 rounded-xl"
            aria-label="إرسال"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="mt-2.5 text-center text-[11px] text-ink-subtle">
          {helperText ?? 'اضغط Ctrl/⌘ + Enter للإرسال'}
        </p>
      </div>
    </div>
  );
}
