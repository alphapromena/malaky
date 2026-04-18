'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function DangerZone({ firstName }: { firstName: string }) {
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const expected = 'حذف';
  const ready = confirm.trim() === expected;

  function onDelete() {
    if (!ready) return;
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/settings/account/delete', { method: 'POST' });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? 'تعذّر الحذف.');
        router.replace('/');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع.');
      }
    });
  }

  return (
    <section className="space-y-4 rounded-2xl border border-danger/30 bg-danger/[0.05] p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger/20 text-danger">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-danger">منطقة خطرة</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-muted">
            حذف الحساب يمحي كل محادثاتك وصورك المُولّدة بشكل دائم. هذا الإجراء لا يمكن التراجع
            عنه يا {firstName}.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-ink-muted">
          اكتب كلمة <span className="font-semibold text-danger">«{expected}»</span> للتأكيد:
        </label>
        <Input
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder={expected}
          className="border-danger/30 focus:border-danger focus:shadow-[0_0_0_4px_rgba(239,68,68,0.15)]"
          disabled={isPending}
        />
      </div>

      {error && (
        <p className="rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          variant="destructive"
          onClick={onDelete}
          disabled={!ready || isPending}
          className="gap-2"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <AlertTriangle className="h-4 w-4" />}
          حذف الحساب نهائياً
        </Button>
      </div>
    </section>
  );
}
