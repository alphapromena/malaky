import Link from 'next/link';
import { ArrowLeft, Sparkles, Zap, Globe2, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WingsLogo } from '@/components/brand/WingsLogo';
import { MODES } from '@/lib/modes';

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-canvas-base">
      {/* ---------- Hero ---------- */}
      <section className="relative isolate overflow-hidden">
        <div className="aurora" />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-28 sm:pt-40">
          {/* Pill */}
          <div className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-border bg-white/[0.04] px-4 py-2 backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
            </span>
            <span className="text-xs text-ink-muted">
              مساعدك الذكي بالعربي —{' '}
              <span className="font-latin text-gold-300">Arabic-first AI</span>
            </span>
          </div>

          {/* Wings mark */}
          <div className="mx-auto mb-6 flex justify-center">
            <WingsLogo size={56} />
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-center">
            <span className="ds-wordmark text-7xl sm:text-8xl md:text-[120px]">ملاكي</span>
          </h1>

          <p className="mx-auto mb-4 max-w-3xl text-balance text-center font-display text-2xl italic text-gold-200 sm:text-3xl">
            The sovereign AI agent of the Arab world.
          </p>

          <p className="mx-auto mb-12 max-w-xl text-balance text-center text-base leading-relaxed text-ink-muted sm:text-lg">
            كاتب يفهم لهجتك، مبرمج يجاوبك بالعربي، ومصمم يولّد صورك من وصف عربي فقط.
          </p>

          {/* CTAs */}
          <div className="mx-auto flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="group">
              <Link href="/writer">
                ابدأ الآن مجاناً
                <ArrowLeft className="h-4 w-4 transition-transform duration-normal group-hover:-translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="#modes">استكشف الأوضاع</Link>
            </Button>
          </div>

          {/* Feature pills */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { icon: Zap, label: 'استجابة فورية', sub: 'Streaming' },
              { icon: Globe2, label: 'يفهم كل اللهجات', sub: '5 لهجات' },
              { icon: Shield, label: 'بياناتك محفوظة', sub: 'Session-based' },
            ].map(({ icon: I, label, sub }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-border bg-white/[0.03] px-4 py-3 backdrop-blur-xl"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-400/15 text-gold-300">
                  <I className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{label}</p>
                  <p className="truncate font-latin text-[10px] uppercase tracking-wider text-ink-subtle">
                    {sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Modes (bento) ---------- */}
      <section id="modes" className="relative mx-auto max-w-6xl px-6 pb-32">
        <div className="mb-12 text-center">
          <p className="ds-meta mb-4">Modes · الأوضاع</p>
          <h2 className="ds-display mb-4 text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="text-gradient-brand">ثلاثة</span> مساعدين
            <br />
            ملاك واحد
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-ink-muted">
            كل وضع يستخدم أحدث نماذج الذكاء الاصطناعي — مُدرَّب خصيصاً للمهمّة.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {MODES.map((m, i) => {
            const Icon = m.icon;
            const featured = i === 1; // middle card bigger on large screens
            return (
              <Link
                key={m.slug}
                href={`/${m.slug}`}
                className={`group relative overflow-hidden rounded-3xl border border-border bg-canvas-elevated/40 p-7 backdrop-blur-xl transition-all duration-normal ease-out hover:-translate-y-1 hover:border-[var(--border-hover)] hover:bg-white/[0.05] ${
                  featured ? 'lg:row-span-1' : ''
                }`}
              >
                {/* Gradient wash on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${m.accent} opacity-0 transition-opacity duration-normal group-hover:opacity-[0.08]`}
                />

                <div className="relative">
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${m.accent} text-white ${m.glow}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>

                  <p className="ds-meta mb-2">{m.nameEn}</p>
                  <h3 className="mb-3 text-3xl font-bold tracking-tight">{m.nameAr}</h3>
                  <p className="mb-6 text-base leading-relaxed text-ink-muted">{m.tagline}</p>

                  <div className="flex items-center justify-between border-t border-border pt-5">
                    <div className="text-xs">
                      <span className="text-ink-subtle">حدّ يومي · </span>
                      <span className="font-semibold text-foreground">
                        {m.limit} {m.limitUnit}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-foreground transition-all duration-normal group-hover:gap-2.5">
                      افتح
                      <ArrowLeft className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Big CTA card */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-gold-400/30 bg-gradient-to-br from-gold-400/10 via-gold-500/10 to-terracotta-400/10 p-10 backdrop-blur-xl">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.04] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
                <Sparkles className="h-3 w-3 text-gold-300" />
                جاهز للبداية؟
              </div>
              <h3 className="mb-2 text-3xl font-bold tracking-tight sm:text-4xl">
                جرّب <span className="ds-wordmark">ملاكي</span> الآن
              </h3>
              <p className="max-w-lg text-base text-ink-muted">
                أنشئ حسابك في ثوانٍ وابدأ.
              </p>
            </div>
            <Button asChild size="xl" className="shrink-0">
              <Link href="/signup">
                دخول
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t border-border bg-canvas-elevated/30 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-10 text-sm text-ink-muted">
          <div className="flex items-center gap-3">
            <WingsLogo size={18} />
            <span className="ds-wordmark text-lg">ملاكي</span>
            <span className="font-latin text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
              Malaky AI
            </span>
          </div>
          <p className="text-center text-pretty text-xs text-ink-subtle">
            صُنع بـ <span className="text-terracotta-400">♥</span> في عمّان · تطوير قصي كنعان ·{' '}
            {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </main>
  );
}
