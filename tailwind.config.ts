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
        // shadcn bridge (resolved to DS tokens via globals.css)
        border: 'var(--border)',
        input: 'var(--border)',
        ring: 'var(--border-focus)',
        background: 'var(--bg)',
        foreground: 'var(--fg)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-fg)',
        },
        secondary: {
          DEFAULT: 'var(--bg-subtle)',
          foreground: 'var(--fg)',
        },
        muted: {
          DEFAULT: 'var(--bg-subtle)',
          foreground: 'var(--fg-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-fg)',
        },
        destructive: {
          DEFAULT: 'var(--danger-500)',
          foreground: 'var(--paper-50)',
        },
        card: {
          DEFAULT: 'var(--bg-raised)',
          foreground: 'var(--fg)',
        },
        popover: {
          DEFAULT: 'var(--bg-raised)',
          foreground: 'var(--fg)',
        },

        // DS palettes
        ink: {
          950: '#0B1220',
          900: '#0F1729',
          800: '#182238',
          700: '#2A3550',
          600: '#4A5775',
        },
        paper: {
          50: '#FFFDF9',
          100: '#FAF7F2',
          200: '#F3EEE5',
          300: '#E8E1D3',
        },
        neutral: {
          50: '#F6F4EF',
          100: '#ECE8E0',
          200: '#D9D3C6',
          300: '#B8B0A0',
          400: '#8B8372',
          500: '#6B6455',
          600: '#4E4839',
          700: '#363124',
          800: '#23201A',
          900: '#14120E',
        },
        gold: {
          50: '#F7F1E8',
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
          100: '#F3D9CD',
          300: '#D88D70',
          500: '#B85B3C',
          DEFAULT: '#B85B3C',
          700: '#7E3A22',
        },
        success: { 100: '#E2EEDF', 500: '#5E8C6A' },
        warning: { 100: '#F7E9CE', 500: '#C68A3E' },
        danger:  { 100: '#F4D9D4', 500: '#B04038' },
        info:    { 100: '#DDE6EF', 500: '#4E6E8E' },
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
        sm:   ['0.875rem', { lineHeight: '1.4' }],
        base: ['1rem',     { lineHeight: '1.65' }],
        md:   ['1.125rem', { lineHeight: '1.65' }],
        lg:   ['1.25rem',  { lineHeight: '1.4' }],
        xl:   ['1.5rem',   { lineHeight: '1.4' }],
        '2xl':['1.875rem', { lineHeight: '1.25' }],
        '3xl':['2.25rem',  { lineHeight: '1.2' }],
        '4xl':['3rem',     { lineHeight: '1.1' }],
        '5xl':['3.75rem',  { lineHeight: '1.05' }],
      },

      borderRadius: {
        xs:   '4px',
        sm:   '6px',
        md:   '8px',
        lg:   '10px',
        xl:   '12px',
        '2xl':'16px',
        full: '9999px',
      },

      boxShadow: {
        xs:    '0 1px 0 0 rgba(35, 28, 18, 0.04)',
        sm:    '0 1px 2px -1px rgba(35, 28, 18, 0.06), 0 1px 3px 0 rgba(35, 28, 18, 0.04)',
        DEFAULT: '0 1px 2px -1px rgba(35, 28, 18, 0.06), 0 1px 3px 0 rgba(35, 28, 18, 0.04)',
        md:    '0 4px 6px -2px rgba(35, 28, 18, 0.06), 0 2px 4px -2px rgba(35, 28, 18, 0.04)',
        lg:    '0 12px 20px -6px rgba(35, 28, 18, 0.08), 0 4px 8px -4px rgba(35, 28, 18, 0.04)',
        xl:    '0 24px 40px -12px rgba(35, 28, 18, 0.12), 0 8px 16px -8px rgba(35, 28, 18, 0.06)',
        gold:  '0 0 0 1px rgba(184, 149, 106, 0.2), 0 8px 24px -8px rgba(184, 149, 106, 0.35)',
        inner: 'inset 0 1px 2px 0 rgba(35, 28, 18, 0.04)',
      },

      transitionTimingFunction: {
        out:    'cubic-bezier(0.2, 0.8, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        fast:   '120ms',
        normal: '200ms',
        slow:   '320ms',
      },

      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up':   { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-in':        { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
        'fade-in':        'fade-in 0.32s cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('tailwindcss-rtl')],
};

export default config;
