'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GoogleButton } from './GoogleButton';
import { getBrowserClient } from '@/lib/supabase/browser';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/writer';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const supabase = getBrowserClient();
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        router.replace(next);
        router.refresh();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع.';
        setError(
          msg.includes('Invalid login')
            ? 'البريد أو كلمة السر غير صحيحة.'
            : msg.includes('Email not confirmed')
              ? 'يرجى تأكيد بريدك الإلكتروني أولاً من خلال الرابط المُرسل لك.'
              : msg,
        );
      }
    });
  }

  return (
    <div className="relative w-full max-w-md animate-scale-in">
      <div className="absolute -inset-8 rounded-[48px] bg-gradient-to-br from-indigo-500/15 via-violet-500/15 to-pink-500/15 opacity-60 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-border bg-canvas-elevated/80 p-8 backdrop-blur-2xl shadow-xl sm:p-10">
        <div className="mb-7 text-center">
          <h1 className="ds-display-ar mb-2 text-3xl font-bold">أهلاً بعودتك</h1>
          <p className="text-sm text-ink-muted">سجّل دخولك للمتابعة إلى ملاكي</p>
        </div>

        <GoogleButton next={next} />

        <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-ink-subtle">
          <div className="h-px flex-1 bg-border" />
          <span>أو</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="flex items-center gap-1.5 text-xs">
              <Mail className="h-3.5 w-3.5" />
              البريد الإلكتروني
            </Label>
            <Input
              id="email"
              type="email"
              dir="ltr"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isPending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password" className="flex items-center gap-1.5 text-xs">
              <Lock className="h-3.5 w-3.5" />
              كلمة السر
            </Label>
            <Input
              id="password"
              type="password"
              dir="ltr"
              autoComplete="current-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isPending}
            />
          </div>

          {error && (
            <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-center text-sm text-danger">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isPending || !email || !password}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الدخول…
              </>
            ) : (
              <>
                دخول
                <ArrowLeft className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-muted">
          ليس لديك حساب؟{' '}
          <Link
            href={`/signup${next !== '/writer' ? `?next=${encodeURIComponent(next)}` : ''}`}
            className="font-medium text-violet-300 hover:text-violet-200"
          >
            أنشئ حساباً جديداً
          </Link>
        </p>
      </div>
    </div>
  );
}
