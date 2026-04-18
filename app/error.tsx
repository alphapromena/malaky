'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas-base p-4 text-center">
      <div className="aurora" />
      <div className="relative max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 text-orange-400">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="ds-display mb-3 text-3xl font-bold">حدث خطأ غير متوقع</h1>
        <p className="mb-8 leading-relaxed text-ink-muted">
          نعتذر، حدث خطأ أثناء معالجة طلبك. حاول مجدداً أو عد للصفحة الرئيسية.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>إعادة المحاولة</Button>
          <Button variant="outline" asChild>
            <a href="/">الصفحة الرئيسية</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
