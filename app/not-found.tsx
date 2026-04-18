import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-canvas-base p-4 text-center">
      <div className="aurora" />
      <div className="relative">
        <h1 className="ds-display mb-4 bg-gradient-to-br from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-[160px] font-bold text-transparent sm:text-[200px]">
          404
        </h1>
        <p className="mb-8 text-xl text-ink-muted">الصفحة غير موجودة</p>
        <Button asChild size="lg">
          <Link href="/">العودة للصفحة الرئيسية</Link>
        </Button>
      </div>
    </div>
  );
}
