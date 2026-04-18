'use client';

import { Suspense, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card className="w-full max-w-md border-border/60 shadow-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-50 text-gold-700 ring-1 ring-gold-200">
          <Lock className="h-6 w-6" />
        </div>
        <CardTitle className="ds-display text-3xl">ملاكي</CardTitle>
        <CardDescription className="pt-1 leading-relaxed">
          أدخل كلمة السر للدخول إلى المنصة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة السر"
            autoFocus
            className="h-12 text-center text-base"
            disabled={isPending}
          />
          {error && (
            <p className="rounded-md border border-danger-500/30 bg-danger-100/70 p-2 text-center text-sm text-danger-500">
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" size="lg" disabled={isPending || !password}>
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
      </CardContent>
    </Card>
  );
}

export default function UnlockPage() {
  return (
    <div className="gradient-signature flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div className="text-paper-50">جاري التحميل…</div>}>
        <UnlockForm />
      </Suspense>
    </div>
  );
}
