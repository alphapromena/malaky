import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // shadcn bridge
        border: 'var(--border)',
        input: 'var(--border)',
        ring: 'var(--accent-2)',
        background: 'var(--bg-primary)',
        foreground: 'var(--fg)',
        primary: {
          DEFAULT: 'var(--fg)',
          foreground: 'var(--bg-primary)',
        },
        secondary: {
          DEFAULT: 'var(--bg-raised)',
          foreground: 'var(--fg)',
        },
        muted: {
          DEFAULT: 'var(--bg-elevated)',
          foreground: 'var(--fg-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent-2)',
          foreground: 'var(--fg)',
        },
        destructive: {
          DEFAULT: 'var(--danger)',
          foreground: 'var(--fg)',
        },
        card: {
          DEFAULT: 'var(--bg-elevated)',
          foreground: 'var(--fg)',
        },
        popover: {
          DEFAULT: 'var(--bg-raised)',
          foreground: 'var(--fg)',
        },

        // Named semantic tokens
        canvas: {
          base:     'var(--bg-primary)',
          elevated: 'var(--bg-elevated)',
          raised:   'var(--bg-raised)',
          overlay:  'var(--bg-overlay)',
        },
        ink: {
          DEFAULT: 'var(--fg)',
          muted:   'var(--fg-muted)',
          subtle:  'var(--fg-subtle)',
          inverse: 'var(--fg-inverse)',
        },

        // Full accent scale (indigo–violet–pink)
        indigo: {
          400: '#818CF8', 500: '#6366F1', 600: '#4F46E5', 700: '#4338CA',
        },
        violet: {
          400: '#A78BFA', 500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9',
        },
        pink: {
          400: '#F472B6', 500: '#EC4899', 600: '#DB2777',
        },
        orange: {
          400: '#FB923C', 500: '#F97316', 600: '#EA580C',
        },
        emerald: {
          400: '#34D399', 500: '#10B981', 600: '#059669',
        },
        cyan: {
          400: '#22D3EE', 500: '#06B6D4', 600: '#0891B2',
        },

        success: '#22C55E',
        warning: '#F59E0B',
        danger:  '#EF4444',
      },

      fontFamily: {
        sans:    ['var(--font-arabic)', 'var(--font-latin)', 'system-ui', 'sans-serif'],
        arabic:  ['var(--font-arabic)', 'system-ui', 'sans-serif'],
        latin:   ['var(--font-latin)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-latin)', 'system-ui', 'sans-serif'],
        mono:    ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        xs:   ['0.75rem',  { lineHeight: '1.4' }],
        sm:   ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem',     { lineHeight: '1.6' }],
        md:   ['1.125rem', { lineHeight: '1.6' }],
        lg:   ['1.25rem',  { lineHeight: '1.5' }],
        xl:   ['1.5rem',   { lineHeight: '1.35' }],
        '2xl':['1.875rem', { lineHeight: '1.2' }],
        '3xl':['2.25rem',  { lineHeight: '1.15' }],
        '4xl':['3rem',     { lineHeight: '1.05' }],
        '5xl':['3.75rem',  { lineHeight: '1' }],
        '6xl':['4.5rem',   { lineHeight: '0.95' }],
        '7xl':['6rem',     { lineHeight: '0.9' }],
        '8xl':['8rem',     { lineHeight: '0.9' }],
      },

      borderRadius: {
        xs:   '0.375rem',
        sm:   '0.5rem',
        md:   '0.75rem',
        lg:   '1rem',
        xl:   '1.25rem',
        '2xl':'1.5rem',
        '3xl':'2rem',
        full: '9999px',
      },

      boxShadow: {
        sm:   'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-md)',
        md:   'var(--shadow-md)',
        lg:   'var(--shadow-lg)',
        xl:   'var(--shadow-xl)',
        glow: 'var(--shadow-glow)',
      },

      transitionTimingFunction: {
        out:    'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      transitionDuration: {
        fast:   '150ms',
        normal: '240ms',
        slow:   '420ms',
      },

      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-in':        { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'scale-in':       { from: { opacity: '0', transform: 'scale(0.96)' }, to: { opacity: '1', transform: 'scale(1)' } },
        'shimmer':        {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(139, 92, 246, 0.45)' },
          '50%':      { boxShadow: '0 0 40px 8px rgba(139, 92, 246, 0.25)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.24s ease-out',
        'accordion-up':   'accordion-up 0.24s ease-out',
        'fade-in':        'fade-in 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in':       'scale-in 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer':        'shimmer 2.4s linear infinite',
        'pulse-glow':     'pulse-glow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwindcss-rtl')],
};

export default config;
