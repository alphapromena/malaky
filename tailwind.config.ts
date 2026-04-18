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
        ring: 'var(--gold-400)',
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
          DEFAULT: 'var(--gold-400)',
          foreground: 'var(--bg-primary)',
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

        // Full gold scale
        gold: {
          50:  '#F7F1E8',
          100: '#EEE1C7',
          200: '#DCC598',
          300: '#C9A875',
          400: '#B8956A',
          DEFAULT: '#B8956A',
          500: '#A07B4E',
          600: '#7F6038',
          700: '#5E4626',
          800: '#3E2E19',
        },
        terracotta: {
          300: '#E4B5A1',
          400: '#D88D70',
          500: '#B85B3C',
          600: '#8C4228',
        },
        emerald: {
          400: '#7FB378', 500: '#5E8C6A',
        },

        success: '#7FB378',
        warning: '#D8A35B',
        danger:  '#D87070',
      },

      fontFamily: {
        sans:    ['var(--font-arabic)', 'var(--font-latin)', 'system-ui', 'sans-serif'],
        arabic:  ['var(--font-arabic)', 'system-ui', 'sans-serif'],
        latin:   ['var(--font-latin)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-arabic)', 'serif'],
        mono:    ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },

      fontSize: {
        xs:   ['0.75rem',  { lineHeight: '1.4' }],
        sm:   ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem',     { lineHeight: '1.65' }],
        md:   ['1.125rem', { lineHeight: '1.65' }],
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
        out:     'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out':'cubic-bezier(0.65, 0, 0.35, 1)',
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
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(184, 149, 106, 0.45)' },
          '50%':      { boxShadow: '0 0 40px 8px rgba(184, 149, 106, 0.25)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.24s ease-out',
        'accordion-up':   'accordion-up 0.24s ease-out',
        'fade-in':        'fade-in 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in':       'scale-in 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-glow':     'pulse-glow 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwindcss-rtl')],
};

export default config;
