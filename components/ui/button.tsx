import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-normal ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 text-white shadow-glow hover:shadow-[0_0_40px_-4px_rgba(139,92,246,0.7)] hover:-translate-y-0.5',
        solid:
          'bg-white text-canvas-base hover:bg-white/90',
        gold:
          'bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-glow hover:-translate-y-0.5',
        outline:
          'border border-border bg-white/[0.03] text-foreground backdrop-blur-md hover:bg-white/[0.08] hover:border-[var(--border-hover)]',
        secondary:
          'bg-canvas-raised text-foreground hover:bg-canvas-overlay',
        ghost: 'text-foreground hover:bg-white/[0.06]',
        destructive: 'bg-danger text-white hover:bg-danger/90',
        link: 'text-violet-400 underline-offset-4 hover:underline hover:text-violet-300',
        onDark:
          'bg-white/10 text-white border border-white/20 backdrop-blur-md hover:bg-white/20',
      },
      size: {
        default: 'h-11 px-5 py-2',
        sm: 'h-9 rounded-lg px-3 text-xs',
        lg: 'h-14 rounded-2xl px-7 text-base font-semibold',
        xl: 'h-16 rounded-2xl px-9 text-lg font-semibold',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
