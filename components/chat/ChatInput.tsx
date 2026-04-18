'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
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
    <div className="border-t border-border bg-paper-100/80 backdrop-blur-md">
      <div className="mx-auto w-full max-w-3xl p-3 sm:p-4">
        <div
          className={cn(
            'flex items-end gap-2 rounded-xl border border-border bg-paper-50 p-2 shadow-sm transition-shadow duration-normal ease-out focus-within:border-gold-400 focus-within:shadow-md',
            disabled && 'opacity-60',
          )}
        >
          <Textarea
            ref={ref}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder={placeholder}
            className="min-h-[52px] resize-none border-0 bg-transparent px-1 shadow-none focus:shadow-none focus:border-0 focus:ring-0"
            rows={2}
            disabled={disabled || submitting}
            dir="auto"
          />
          <Button
            onClick={fire}
            disabled={!value.trim() || submitting || disabled}
            size="icon"
            className="h-10 w-10 shrink-0"
            aria-label="إرسال"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <p className="mt-2 text-center text-[11px] text-fg-subtle">
          {helperText ?? 'اضغط Ctrl/⌘ + Enter للإرسال'}
        </p>
      </div>
    </div>
  );
}
