'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UnlockPage() {
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
    <div className="gradient-navy-gold flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-gold-900">
            <Lock className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl">ملاكي</CardTitle>
          <CardDescription>أدخل كلمة السر للدخول إلى المنصة</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة السر"
                autoFocus
                className="text-center text-lg"
                disabled={isPending}
              />
            </div>
            {error && (
              <p className="rounded-md bg-destructive/10 p-2 text-center text-sm text-destructive">
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
    </div>
  );
}
