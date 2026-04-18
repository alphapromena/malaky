'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Mail, Lock, User as UserIcon, Calendar, ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { GoogleButton } from './GoogleButton';
import { getBrowserClient } from '@/lib/supabase/browser';

const profileSchema = z.object({
  firstName: z.string().trim().min(2, 'الاسم الأول يجب أن يكون حرفين على الأقل').max(40),
  lastName: z.string().trim().min(2, 'اسم العائلة يجب أن يكون حرفين على الأقل').max(40),
  age: z
    .number({ invalid_type_error: 'العمر مطلوب' })
    .int()
    .min(13, 'يجب أن تكون 13 سنة أو أكثر')
    .max(120, 'العمر غير صحيح'),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'يجب الموافقة على شروط الاستخدام.' }),
  }),
});

const schema = profileSchema.extend({
  email: z.string().trim().email('البريد غير صالح').max(120),
  password: z
    .string()
    .min(8, 'كلمة السر يجب أن تكون 8 أحرف على الأقل')
    .max(120, 'كلمة السر طويلة جداً'),
});

export function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/writer';
  const completeProfile = params.get('complete') === '1';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const activeSchema = completeProfile ? profileSchema : schema;
    const input = completeProfile
      ? { firstName, lastName, age: Number(age), terms }
      : { firstName, lastName, age: Number(age), email, password, terms };

    const parsed = activeSchema.safeParse(input);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'بيانات غير صحيحة.');
      return;
    }

    const data = parsed.data as {
      firstName: string;
      lastName: string;
      age: number;
      email?: string;
      password?: string;
    };

    startTransition(async () => {
      try {
        const supabase = getBrowserClient();
        const origin = window.location.origin;

        if (completeProfile) {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error('لم يتم العثور على جلسة نشطة.');

          const { error: upsertErr } = await supabase.from('profiles').upsert({
            id: user.id,
            first_name: data.firstName,
            last_name: data.lastName,
            age: data.age,
            terms_accepted_at: new Date().toISOString(),
          });
          if (upsertErr) throw upsertErr;
          router.replace(next);
          router.refresh();
          return;
        }

        const { data: signupData, error: signupErr } = await supabase.auth.signUp({
          email: data.email!,
          password: data.password!,
          options: {
            emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
            data: {
              first_name: data.firstName,
              last_name: data.lastName,
              age: data.age,
            },
          },
        });

        if (signupErr) {
          if (signupErr.message.includes('already')) {
            throw new Error('هذا البريد مسجّل مسبقاً. سجّل دخولك بدلاً من ذلك.');
          }
          throw signupErr;
        }

        if (signupData.session && signupData.user) {
          const { error: profileErr } = await supabase.from('profiles').upsert({
            id: signupData.user.id,
            first_name: data.firstName,
            last_name: data.lastName,
            age: data.age,
            terms_accepted_at: new Date().toISOString(),
          });
          if (profileErr) throw profileErr;
          router.replace(next);
          router.refresh();
        } else {
          router.replace('/signup/check-email');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع.');
      }
    });
  }

  return (
    <div className="relative my-10 w-full max-w-md animate-scale-in">
      <div className="absolute -inset-8 rounded-[48px] bg-gradient-to-br from-gold-300/15 via-gold-400/15 to-gold-600/15 opacity-60 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-border bg-canvas-elevated/80 p-8 backdrop-blur-2xl shadow-xl sm:p-10">
        <div className="mb-7 text-center">
          <h1 className="ds-wordmark mb-2 text-4xl">
            {completeProfile ? 'أكمل ملفك الشخصي' : 'أهلاً في ملاكي'}
          </h1>
          <p className="text-sm text-ink-muted">
            {completeProfile
              ? 'أضف بياناتك البسيطة للمتابعة'
              : 'أنشئ حسابك في ثوانٍ وابدأ المحادثة'}
          </p>
        </div>

        {!completeProfile && (
          <>
            <GoogleButton label="التسجيل بحساب Google" next={next} />
            <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-ink-subtle">
              <div className="h-px flex-1 bg-border" />
              <span>أو</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="flex items-center gap-1.5 text-xs">
                <UserIcon className="h-3.5 w-3.5" />
                الاسم الأول
              </Label>
              <Input
                id="firstName"
                autoComplete="given-name"
                required
                minLength={2}
                maxLength={40}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isPending}
                placeholder="قصي"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-xs">
                اسم العائلة
              </Label>
              <Input
                id="lastName"
                autoComplete="family-name"
                required
                minLength={2}
                maxLength={40}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isPending}
                placeholder="كنعان"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="age" className="flex items-center gap-1.5 text-xs">
              <Calendar className="h-3.5 w-3.5" />
              العمر
            </Label>
            <Input
              id="age"
              type="number"
              inputMode="numeric"
              min={13}
              max={120}
              required
              value={age}
              onChange={(e) => setAge(e.target.value)}
              disabled={isPending}
              placeholder="25"
            />
          </div>

          {!completeProfile && (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="flex items-center gap-1.5 text-xs">
                  <Mail className="h-3.5 w-3.5" />
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  dir="ltr"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isPending}
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="flex items-center gap-1.5 text-xs">
                  <Lock className="h-3.5 w-3.5" />
                  كلمة السر
                </Label>
                <Input
                  id="password"
                  type="password"
                  dir="ltr"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isPending}
                  placeholder="8 أحرف على الأقل"
                />
              </div>
            </>
          )}

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]">
            <Checkbox
              id="terms"
              checked={terms}
              onCheckedChange={(v) => setTerms(Boolean(v))}
              disabled={isPending}
              className="mt-0.5"
            />
            <span className="text-xs leading-relaxed text-ink-muted">
              أوافق على{' '}
              <Link href="/terms" className="text-gold-300 underline decoration-gold-400/40 hover:text-gold-200" target="_blank">
                شروط الاستخدام
              </Link>{' '}
              و
              <Link href="/privacy" className="text-gold-300 underline decoration-gold-400/40 hover:text-gold-200" target="_blank">
                سياسة الخصوصية
              </Link>
              . أدرك أنّ بياناتي تُخزَّن لتقديم الخدمة.
            </span>
          </label>

          {error && (
            <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-center text-sm text-danger">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={isPending || !terms}>
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الإنشاء…
              </>
            ) : (
              <>
                {completeProfile ? 'حفظ ومتابعة' : 'إنشاء الحساب'}
                <ArrowLeft className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {!completeProfile && (
          <p className="mt-6 text-center text-sm text-ink-muted">
            عندك حساب؟{' '}
            <Link href="/login" className="font-medium text-gold-300 hover:text-gold-200">
              سجّل دخولك
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
