import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'سياسة الخصوصية — ملاكي' };

export default function PrivacyPage() {
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

        <h1 className="ds-display mb-3 text-4xl font-bold">سياسة الخصوصية</h1>
        <p className="mb-10 text-sm text-ink-subtle">آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>

        <div className="space-y-6 text-sm leading-[1.9] text-ink-muted">
          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">البيانات التي نجمعها</h2>
            <ul className="list-disc space-y-1 pe-5">
              <li>الاسم الأول واسم العائلة.</li>
              <li>العمر (للتحقق من الأهلية).</li>
              <li>البريد الإلكتروني.</li>
              <li>محتوى محادثاتك والصور المولّدة — لعرض سجلّك فقط.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">كيف نستخدمها</h2>
            <p>لتقديم الخدمة، إدارة حدود الاستخدام اليومية، والتواصل معك عند الحاجة. لا نبيع بياناتك.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">مزوّدو الخدمة</h2>
            <p>نستخدم: Supabase (قاعدة البيانات + المصادقة)، Anthropic و Google (نماذج الذكاء). كل مزوّد له سياسة خصوصية خاصة.</p>
          </section>

          <section>
            <h2 className="mb-2 text-lg font-semibold text-foreground">حقوقك</h2>
            <p>يحقّ لك طلب حذف حسابك وبياناتك في أي وقت عبر التواصل معنا.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
