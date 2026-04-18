import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper-100 p-4 text-center">
      <h1 className="ds-display text-6xl text-fg-subtle">404</h1>
      <p className="text-xl text-foreground">الصفحة غير موجودة</p>
      <Button asChild variant="gold">
        <Link href="/">العودة للصفحة الرئيسية</Link>
      </Button>
    </div>
  );
}
