'use client';

import { Suspense, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function UnlockForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') ?? '/writer';

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const res = await fetch('/api/unlock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setError(data.error ?? 'حدث خطأ غير متوقع.');
          return;
        }
        router.replace(from);
        router.refresh();
      } catch {
        setError('تعذّر الاتصال بالخادم.');
      }
    });
  }

  return (
    <div className="relative w-full max-w-md animate-scale-in">
      {/* Glow halo */}
      <div className="absolute -inset-8 rounded-[48px] bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-pink-500/20 opacity-60 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-border bg-canvas-elevated/80 p-8 backdrop-blur-2xl shadow-xl sm:p-10">
        {/* Brand mark */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 blur-xl opacity-60 animate-pulse-glow" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 shadow-glow">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
          </div>
          <h1 className="ds-display-ar text-4xl font-bold">ملاكي</h1>
          <p className="mt-2 font-latin text-[11px] uppercase tracking-[0.25em] text-ink-subtle">
            Malaky AI
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-medium text-ink-muted">
              <Lock className="h-3.5 w-3.5" />
              كلمة السر
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              className="h-12 text-center text-lg tracking-widest"
              disabled={isPending}
            />
          </div>
          {error && (
            <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-center text-sm text-danger">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isPending || !password}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري التحقق…
              </>
            ) : (
              'دخول'
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-[11px] text-ink-subtle">
          بدخولك توافق على حفظ جلستك محلياً لمدة 7 أيام
        </p>
      </div>
    </div>
  );
}

export default function UnlockPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas-base p-4">
      <div className="aurora" />
      <Suspense
        fallback={
          <div className="text-ink-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        }
      >
        <UnlockForm />
      </Suspense>
    </div>
  );
}
