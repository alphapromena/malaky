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
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <h1 className="text-2xl font-bold">حدث خطأ غير متوقع</h1>
      <p className="max-w-md text-muted-foreground">
        نعتذر، حدث خطأ أثناء معالجة طلبك. حاول مجدداً أو عد للصفحة الرئيسية.
      </p>
      <div className="flex gap-2">
        <Button onClick={reset}>إعادة المحاولة</Button>
        <Button variant="outline" asChild>
          <a href="/">الصفحة الرئيسية</a>
        </Button>
      </div>
    </div>
  );
}
