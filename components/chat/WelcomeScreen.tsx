'use client';

import {
  BookOpen,
  Code2,
  Feather,
  Hash,
  Mail,
  Palette,
  PenTool,
  Search,
  Sparkles,
  Type,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { WingsLogo } from '@/components/brand/WingsLogo';
import { getModeConfigByMode } from '@/lib/modes';
import type { Mode } from '@/types/database';
import { cn } from '@/lib/utils';

type Suggestion = { icon: LucideIcon; text: string };

const SUGGESTIONS: Record<Mode, Suggestion[]> = {
  WRITER: [
    { icon: Feather, text: 'اكتبلي مقالة قصيرة عن قهوة الصباح وطقوسها' },
    { icon: Mail,    text: 'صيغلي إيميل رسمي لرفض عرض عمل بلطف' },
    { icon: Hash,    text: 'اقترحلي عناوين جذابة لبوست عن الذكاء الاصطناعي' },
    { icon: Type,    text: 'راجعلي النص التالي وحسّن أسلوبه:' },
  ],
  CODER: [
    { icon: Code2,    text: 'اشرحلي async/await في JavaScript مع مثال عملي' },
    { icon: Code2,    text: 'اعمل مكوّن React لقائمة مهام بـ TypeScript' },
    { icon: BookOpen, text: 'كيف أنشئ API endpoint في Next.js مع التحقق من المدخلات' },
    { icon: Search,   text: 'الفرق بين SQL و NoSQL ومتى أستخدم كل واحد' },
  ],
  DESIGNER: [
    { icon: Palette,  text: 'قهوة عربية فوق طاولة خشبية قديمة، ضوء ذهبي دافئ' },
    { icon: Palette,  text: 'منظر صحراوي وقت الغروب بألوان برتقالية ودافئة' },
    { icon: PenTool,  text: 'شخصية كرتونية لبطل عربي بأزياء تراثية' },
    { icon: Sparkles, text: 'شعار بسيط لمقهى اسمه «أرابيسك» بطابع حديث' },
  ],
};

export function WelcomeScreen({
  mode,
  onPick,
}: {
  mode: Mode;
  onPick: (text: string) => void;
}) {
  const cfg = getModeConfigByMode(mode);
  const suggestions = SUGGESTIONS[mode];

  return (
    <div className="mx-auto flex h-full min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center px-5 py-10 text-center animate-fade-in">
      {/* Animated logo tile */}
      <div className="relative mb-7">
        <div
          className={cn(
            'absolute inset-0 rounded-full blur-2xl opacity-60 animate-pulse-glow',
            'bg-gradient-to-br',
            cfg.accent,
          )}
          aria-hidden
        />
        <div className="relative flex h-20 w-28 items-center justify-center rounded-3xl bg-canvas-raised shadow-glow">
          <WingsLogo size={34} />
        </div>
      </div>

      {/* Mode pill */}
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-ink-subtle">
        <span className="font-latin">{cfg.nameEn}</span>
        <span>·</span>
        <span>{cfg.nameAr}</span>
      </div>

      {/* Wordmark + greeting */}
      <h1 className="ds-wordmark mb-3 text-6xl">ملاكي</h1>
      <p className="mb-10 max-w-md text-balance text-base leading-relaxed text-ink-muted">
        جاهز لمساعدتك — اسأل أي شي أو جرّب اقتراحاً من الأسفل.
      </p>

      {/* Suggestion cards */}
      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onPick(s.text)}
              className="group flex items-start gap-3 rounded-2xl border border-border bg-white/[0.02] p-3.5 text-start text-sm text-ink-muted transition-all duration-fast hover:-translate-y-0.5 hover:border-gold-400/40 hover:bg-white/[0.05] hover:text-foreground"
            >
              <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gold-400/10 text-gold-300 transition-colors group-hover:bg-gold-400/20 group-hover:text-gold-200">
                <Icon className="h-3.5 w-3.5" />
              </span>
              <span className="leading-relaxed">{s.text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
