import * as React from 'react';
import { cn } from '@/lib/utils';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-xl border border-border bg-white/[0.03] px-4 py-3 text-sm text-foreground placeholder:text-ink-subtle backdrop-blur-xl transition-[box-shadow,border-color,background] duration-fast',
          'focus:border-violet-500/50 focus:bg-white/[0.06] focus:outline-none focus:ring-0 focus:shadow-[0_0_0_4px_rgba(139,92,246,0.2)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
