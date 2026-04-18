'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DIALECT_LABELS, TONE_LABELS, type PreferredDialect, type Tone } from '@/lib/profile';
import type { Profile } from '@/types/database';

export function ProfileForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [firstName, setFirstName] = useState(profile.first_name);
  const [lastName, setLastName] = useState(profile.last_name);
  const [nickname, setNickname] = useState(profile.nickname ?? '');
  const [dialect, setDialect] = useState<PreferredDialect>(
    (profile.preferred_dialect as PreferredDialect) ?? 'AUTO',
  );
  const [tone, setTone] = useState<Tone>((profile.tone as Tone) ?? 'friendly');
  const [instructions, setInstructions] = useState(profile.custom_instructions ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    startTransition(async () => {
      try {
        const res = await fetch('/api/settings/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            nickname: nickname.trim() || null,
            preferredDialect: dialect,
            tone,
            customInstructions: instructions.trim() || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'حدث خطأ.');
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع.');
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {/* Identity */}
      <section className="space-y-4">
        <header>
          <h2 className="text-lg font-semibold">الاسم</h2>
          <p className="text-sm text-ink-muted">كيف تعرّف عن نفسك على المنصة.</p>
        </header>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="firstName">الاسم الأول</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              minLength={2}
              maxLength={40}
              disabled={isPending}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lastName">اسم العائلة</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              minLength={2}
              maxLength={40}
              disabled={isPending}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="nickname">
            الاسم المُفضّل للـ AI
            <span className="ms-2 font-latin text-[10px] uppercase tracking-wider text-ink-subtle">
              optional
            </span>
          </Label>
          <Input
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="مثال: قصي، أبو محمد، Q…"
            maxLength={40}
            disabled={isPending}
          />
          <p className="text-xs text-ink-subtle">
            إذا خلّيتها فاضية، راح يستخدم الـ AI اسمك الأول.
          </p>
        </div>
      </section>

      <hr className="border-border" />

      {/* AI behavior */}
      <section className="space-y-4">
        <header>
          <h2 className="text-lg font-semibold">سلوك الـ AI</h2>
          <p className="text-sm text-ink-muted">عدّل طريقة ملاكي معك.</p>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>اللهجة المفضّلة</Label>
            <Select value={dialect} onValueChange={(v) => setDialect(v as PreferredDialect)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(DIALECT_LABELS) as PreferredDialect[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {DIALECT_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>النبرة</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(TONE_LABELS) as Tone[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {TONE_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="instructions">
            تعليمات مُخصّصة
            <span className="ms-2 font-latin text-[10px] uppercase tracking-wider text-ink-subtle">
              optional
            </span>
          </Label>
          <Textarea
            id="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="مثال: أنا مطوّر ويب، أفضّل الشرح المبسّط مع أمثلة قصيرة. لا تستخدم مصطلحات تقنية معقّدة دون شرح."
            rows={4}
            maxLength={1200}
            disabled={isPending}
          />
          <p className="text-xs text-ink-subtle">
            راح يضاف هذا النص لكل محادثاتك تلقائياً. يظهر للـ AI بدون أن يراه المستخدمون الآخرون.
          </p>
        </div>
      </section>

      {error && (
        <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-400">
            <Check className="h-4 w-4" />
            تم الحفظ
          </span>
        )}
        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          حفظ التغييرات
        </Button>
      </div>
    </form>
  );
}
