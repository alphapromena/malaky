import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-12 w-full rounded-xl border border-border bg-white/[0.03] px-4 py-2 text-sm text-foreground placeholder:text-ink-subtle backdrop-blur-xl transition-[box-shadow,border-color,background] duration-fast',
        'focus:border-gold-400/50 focus:bg-white/[0.06] focus:outline-none focus:ring-0 focus:shadow-[0_0_0_4px_rgba(184,149,106,0.22)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export { Input };
