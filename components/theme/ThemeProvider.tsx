'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type ThemeChoice = 'light' | 'dark' | 'auto';
export type ResolvedTheme = 'light' | 'dark';

type ThemeContextValue = {
  theme: ThemeChoice;
  resolved: ResolvedTheme;
  setTheme: (t: ThemeChoice) => void;
};

const STORAGE_KEY = 'malaky_theme';
const DEFAULT_THEME: ThemeChoice = 'dark';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function prefersLight(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-color-scheme: light)').matches;
}

function applyTheme(choice: ThemeChoice): ResolvedTheme {
  if (typeof document === 'undefined') return 'dark';
  const resolved: ResolvedTheme =
    choice === 'auto' ? (prefersLight() ? 'light' : 'dark') : choice;
  const html = document.documentElement;
  html.classList.remove('light', 'dark');
  html.classList.add(resolved);
  return resolved;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeChoice>(DEFAULT_THEME);
  const [resolved, setResolved] = useState<ResolvedTheme>('dark');

  // Initial read from localStorage + initial apply.
  useEffect(() => {
    let initial: ThemeChoice = DEFAULT_THEME;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark' || stored === 'auto') {
        initial = stored;
      }
    } catch {
      /* ignore */
    }
    setThemeState(initial);
    setResolved(applyTheme(initial));
  }, []);

  // Re-apply when user picks a theme.
  const setTheme = useCallback((t: ThemeChoice) => {
    setThemeState(t);
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {
      /* ignore */
    }
    setResolved(applyTheme(t));
  }, []);

  // If auto, listen to system changes.
  useEffect(() => {
    if (theme !== 'auto') return;
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const handler = () => setResolved(applyTheme('auto'));
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolved, setTheme }),
    [theme, resolved, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    // Fallback for components rendered outside the provider during SSR.
    return {
      theme: DEFAULT_THEME,
      resolved: 'dark',
      setTheme: () => {},
    };
  }
  return ctx;
}
