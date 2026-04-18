import * as React from 'react';
import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        'flex h-10 w-full rounded-md border border-border bg-paper-50 px-3 py-2 text-sm text-foreground placeholder:text-fg-subtle transition-[box-shadow,border-color] duration-fast',
        'focus:border-gold-400 focus:outline-none focus:ring-0 focus:shadow-[0_0_0_3px_rgba(184,149,106,0.2)]',
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
