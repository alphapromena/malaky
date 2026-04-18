import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'شروط الاستخدام — ملاكي' };

export default function TermsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-canvas-base py-16">
      <div className="aurora" />
      <article className="relative mx-auto max-w-2xl rounded-3xl border border-border bg-canvas-elevated/60 p-10 backdrop-blur-2xl">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link href="/">
            <ArrowRight className="h-4 w-4" />
            العودة
          </Link>
        </Button>

        <h1 className="ds-display mb-3 text-4xl font-bold">شروط الاستخدام</h1>
        <p className="mb-10 text-sm text-ink-subtle">آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>

        <div className="space-y-6 text-sm leading-[1.9] text-ink-muted">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">١. قبول الشروط</h2>
            <p>
              باستخدامك منصة ملاكي، فإنك توافق على هذه الشروط. إذا لم توافق، يرجى عدم استخدام
              الخدمة.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">٢. الأهلية</h2>
            <p>يجب أن يكون عمرك 13 سنة أو أكثر لاستخدام ملاكي.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">٣. الاستخدام المقبول</h2>
            <p>
              لا يجوز استخدام المنصة لإنتاج محتوى ضار، غير قانوني، أو مسيء. تحتفظ المنصة بالحق في
              تعليق الحسابات المخالفة.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">٤. المحتوى المُولَّد</h2>
            <p>
              أنت مسؤول عمّا تولّده أو تكتبه. الذكاء الاصطناعي قد يُخطئ أحياناً — راجع النتائج قبل
              استخدامها.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">٥. الخصوصية</h2>
            <p>
              راجع{' '}
              <Link href="/privacy" className="text-gold-300 hover:text-gold-200">
                سياسة الخصوصية
              </Link>{' '}
              لمعرفة كيفية تعاملنا مع بياناتك.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">٦. التغييرات</h2>
            <p>
              قد نحدّث هذه الشروط من وقت لآخر. سنعلمك بالتغييرات الجوهرية عبر بريدك الإلكتروني.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
