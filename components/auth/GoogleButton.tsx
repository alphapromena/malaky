'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBrowserClient } from '@/lib/supabase/browser';

export function GoogleButton({
  label = 'المتابعة بحساب Google',
  next,
}: {
  label?: string;
  next?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle() {
    setError(null);
    setLoading(true);
    try {
      const supabase = getBrowserClient();
      const origin = window.location.origin;
      const redirectTo = `${origin}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`;
      const { error: err } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      if (err) throw err;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر الدخول بحساب Google.');
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" className="w-full gap-3" onClick={handle} disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
            <path
              fill="#EA4335"
              d="M12 10.2v3.96h5.52c-.24 1.44-1.68 4.2-5.52 4.2-3.36 0-6.12-2.76-6.12-6.24s2.76-6.24 6.12-6.24c1.92 0 3.24.84 3.96 1.56l2.76-2.64C16.92 3 14.64 1.8 12 1.8 6.36 1.8 1.8 6.36 1.8 12S6.36 22.2 12 22.2c6.96 0 11.52-4.92 11.52-11.82 0-.72-.12-1.44-.24-2.16H12z"
            />
          </svg>
        )}
        {label}
      </Button>
      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 p-2 text-center text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
