import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MODES } from '@/lib/modes';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="gradient-navy-gold relative overflow-hidden">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center text-white sm:py-28">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span>مساعدك الذكي بالعربي</span>
          </div>
          <h1 className="mb-6 text-balance text-4xl font-bold leading-tight sm:text-6xl">
            ملاكي
            <br />
            <span className="bg-gradient-to-l from-gold to-amber-200 bg-clip-text text-transparent">
              ثلاثة أوضاع. حكاية واحدة.
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-balance text-lg text-white/80 sm:text-xl">
            كاتب يفهم لهجتك، مبرمج يجاوبك بالعربي، ومصمم يولّد صورك من وصف عربي فقط. كل هذا في مكان
            واحد.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" variant="gold" className="text-base">
              <Link href="/writer">
                ابدأ الآن
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
            >
              <Link href="#modes">استكشف الأوضاع</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Modes */}
      <section id="modes" className="container py-16 sm:py-24">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold sm:text-4xl">اختر وضعك المفضّل</h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            كل وضع يستخدم نموذج ذكاء مختلف مُصمَّم خصيصاً للمهمة التي بين يديك.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MODES.map((m) => {
            const Icon = m.icon;
            return (
              <Link key={m.slug} href={`/${m.slug}`} className="group">
                <Card className="h-full transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg">
                  <CardHeader>
                    <div
                      className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${m.accent} text-white shadow-md`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{m.nameAr}</CardTitle>
                    <CardDescription>{m.tagline}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-muted-foreground">
                      حدّ يومي: <span className="font-medium text-foreground">{m.limit}</span>{' '}
                      {m.limitUnit}
                    </p>
                    <div className="flex items-center gap-1 text-sm font-medium text-accent-foreground/90 group-hover:gap-2 group-hover:text-accent transition-all">
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
      <footer className="border-t bg-muted/30 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>
            صُنع بـ ♥ في عمّان · تطوير قصي كنعان · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </main>
  );
}
