import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MODES } from '@/lib/modes';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-paper-100">
      {/* Hero — signature navy→gold gradient */}
      <section className="gradient-signature relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center text-paper-50 sm:py-28">
          <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-gold-300" />
            <span className="text-paper-50/90">مساعدك الذكي بالعربي</span>
          </div>

          <h1 className="ds-display mb-6 text-5xl sm:text-6xl md:text-7xl">
            ملاكي
          </h1>
          <p className="ds-display mx-auto mb-10 max-w-2xl text-balance text-xl italic text-gold-200 sm:text-2xl">
            ثلاثة أوضاع. حكاية واحدة.
          </p>

          <p className="mx-auto mb-12 max-w-xl text-balance text-base leading-relaxed text-paper-50/75 sm:text-lg">
            كاتب يفهم لهجتك، مبرمج يجاوبك بالعربي، ومصمم يولّد صورك من وصف عربي فقط.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="gold" className="text-base">
              <Link href="/writer">
                ابدأ الآن
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="onDark">
              <Link href="#modes">استكشف الأوضاع</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Modes */}
      <section id="modes" className="container py-20 sm:py-28">
        <div className="mb-12 text-center">
          <p className="ds-meta mb-4">الأوضاع</p>
          <h2 className="ds-display mb-4 text-3xl sm:text-4xl">اختر وضعك المفضّل</h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-fg-muted">
            كل وضع يستخدم نموذج ذكاء مختلف مُصمَّم خصيصاً للمهمة التي بين يديك.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MODES.map((m) => {
            const Icon = m.icon;
            return (
              <Link key={m.slug} href={`/${m.slug}`} className="group block">
                <Card className="h-full hover:-translate-y-0.5 hover:shadow-md">
                  <CardHeader>
                    <div
                      className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-bl ${m.accent} text-paper-50 shadow-sm`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl">{m.nameAr}</CardTitle>
                    <CardDescription className="pt-1">{m.tagline}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-fg-muted">
                      حدّ يومي: <span className="font-medium text-foreground">{m.limit}</span>{' '}
                      {m.limitUnit}
                    </p>
                    <div className="flex items-center gap-1 text-sm font-medium text-gold-700 transition-[gap] duration-normal ease-out group-hover:gap-2">
                      افتح الوضع
                      <ArrowLeft className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-paper-200/40 py-10">
        <div className="container flex flex-col items-center gap-3 text-sm text-fg-muted">
          <Image
            src="/brand/wordmark.svg"
            alt="Malaky"
            width={140}
            height={36}
            className="opacity-80"
          />
          <p className="text-pretty">
            صُنع بـ <span className="text-terracotta-500">♥</span> في عمّان · تطوير قصي كنعان ·{' '}
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </main>
  );
}
