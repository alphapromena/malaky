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
      <div className="flex items-center justify-center py-6 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="px-3 py-6 text-center text-sm text-muted-foreground">
        لا توجد محادثات سابقة
      </div>
    );
  }

  return (
    <ul className="space-y-1 p-1">
      {items.map((c) => {
        const href = `/${slug}/c/${c.id}`;
        const active = pathname === href;
        return (
          <li key={c.id}>
            <Link
              href={href}
              className={cn(
                'group flex items-start gap-2 rounded-md px-2 py-2 text-sm transition-colors',
                active ? 'bg-accent/20 text-foreground' : 'hover:bg-muted',
              )}
            >
              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{c.title ?? 'محادثة جديدة'}</p>
                <p className="text-xs text-muted-foreground">
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
