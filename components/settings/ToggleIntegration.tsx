'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, Plug, Unplug } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ToggleIntegration({ id, connected }: { id: string; connected: boolean }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function toggle(action: 'enable' | 'disable') {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/integrations/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? 'تعذّر تنفيذ الطلب.');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع.');
      }
    });
  }

  return (
    <div className="space-y-3">
      {connected ? (
        <>
          <div className="flex items-center gap-2 rounded-xl border border-gold-400/30 bg-gold-400/10 px-4 py-3 text-sm text-gold-200">
            <CheckCircle2 className="h-4 w-4" />
            هذا التكامل مُفعَّل على حسابك.
          </div>
          <Button
            variant="outline"
            size="lg"
            className="w-full gap-2"
            onClick={() => toggle('disable')}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Unplug className="h-4 w-4" />}
            إلغاء التفعيل
          </Button>
        </>
      ) : (
        <Button
          size="lg"
          className="w-full gap-2"
          onClick={() => toggle('enable')}
          disabled={isPending}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plug className="h-4 w-4" />}
          تفعيل
        </Button>
      )}
      {error && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-center text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
