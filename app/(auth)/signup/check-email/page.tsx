import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CheckEmailPage() {
  return (
    <div className="relative w-full max-w-md animate-scale-in">
      <div className="absolute -inset-8 rounded-[48px] bg-gradient-to-br from-indigo-500/15 via-violet-500/15 to-pink-500/15 opacity-60 blur-3xl" />
      <div className="relative overflow-hidden rounded-3xl border border-border bg-canvas-elevated/80 p-10 text-center backdrop-blur-2xl shadow-xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-glow">
          <MailCheck className="h-6 w-6 text-white" />
        </div>
        <h1 className="ds-display-ar mb-2 text-2xl font-bold">تحقق من بريدك</h1>
        <p className="mb-6 text-sm leading-relaxed text-ink-muted">
          أرسلنا لك رابط تأكيد. اضغط عليه لتفعيل حسابك ثم عد لتسجيل الدخول.
        </p>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">العودة لتسجيل الدخول</Link>
        </Button>
      </div>
    </div>
  );
}
