'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2, MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatRelativeTime, cn } from '@/lib/utils';
import type { Mode } from '@/types/database';

type ConversationRow = {
  id: string;
  mode: string;
  title: string | null;
  dialect_used: string | null;
  updated_at: string | null;
  created_at: string | null;
};

export function ConversationList({ mode, slug }: { mode: Mode; slug: string }) {
  const [items, setItems] = useState<ConversationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetch(`/api/conversations?mode=${mode}`)
      .then((r) => r.json())
      .then((data: { conversations?: ConversationRow[] }) => {
        if (!ignore) setItems(data.conversations ?? []);
      })
      .catch(() => {
        if (!ignore) setItems([]);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [mode, pathname]);

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('هل أنت متأكد من حذف هذه المحادثة؟')) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/conversations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((c) => c.id !== id));
        if (pathname.endsWith(`/c/${id}`)) router.push(`/${slug}`);
      }
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6 text-ink-subtle">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-4 my-6 rounded-xl border border-dashed border-border/80 px-4 py-8 text-center">
        <MessageSquare className="mx-auto mb-3 h-5 w-5 text-ink-subtle" />
        <p className="text-sm text-ink-muted">لا توجد محادثات بعد</p>
        <p className="mt-1 text-xs text-ink-subtle">ابدأ محادثة جديدة لتظهر هنا</p>
      </div>
    );
  }

  return (
    <ul className="space-y-1 p-3">
      {items.map((c) => {
        const href = `/${slug}/c/${c.id}`;
        const active = pathname === href;
        return (
          <li key={c.id}>
            <Link
              href={href}
              className={cn(
                'group relative flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-all duration-fast',
                active
                  ? 'border-violet-500/30 bg-violet-500/10 text-foreground shadow-[inset_0_0_0_1px_rgba(139,92,246,0.1)]'
                  : 'border-transparent text-ink-muted hover:bg-white/[0.04] hover:text-foreground',
              )}
            >
              <MessageSquare
                className={cn(
                  'mt-0.5 h-4 w-4 shrink-0',
                  active ? 'text-violet-400' : 'text-ink-subtle',
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium leading-snug">
                  {c.title ?? 'محادثة جديدة'}
                </p>
                <p className="mt-0.5 text-[11px] text-ink-subtle">
                  {c.updated_at ? formatRelativeTime(c.updated_at) : ''}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => handleDelete(c.id, e)}
                disabled={deleting === c.id}
                aria-label="حذف المحادثة"
              >
                {deleting === c.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </Button>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
