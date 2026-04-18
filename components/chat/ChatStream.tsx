'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { ChatInput, type AttachmentFile, type ActiveIntegration } from './ChatInput';
import { MessageList, type UiMessage } from './MessageList';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WingsLogo } from '@/components/brand/WingsLogo';
import { getModeConfigByMode } from '@/lib/modes';
import type { Mode } from '@/types/database';

type InitialMessageRow = {
  id: string;
  role: string;
  content: string;
};

export function ChatStream({
  mode,
  conversationId,
  initialMessages,
}: {
  mode: Mode;
  conversationId: string | null;
  initialMessages?: InitialMessageRow[];
}) {
  const cfg = getModeConfigByMode(mode);
  const router = useRouter();
  const [messages, setMessages] = useState<UiMessage[]>(() =>
    (initialMessages ?? [])
      .filter((m): m is InitialMessageRow & { role: 'user' | 'assistant' } =>
        m.role === 'user' || m.role === 'assistant',
      )
      .map((m) => ({ id: m.id, role: m.role, content: m.content })),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIntegrations, setActiveIntegrations] = useState<ActiveIntegration[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  useEffect(() => {
    let ignore = false;
    fetch('/api/integrations')
      .then((r) => r.json())
      .then((data: { connected?: ActiveIntegration[] }) => {
        if (!ignore) setActiveIntegrations(data.connected ?? []);
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  const endpoint = mode === 'WRITER' ? '/api/writer' : '/api/coder';

  const submit = useCallback(
    async (text: string, files: AttachmentFile[] = []) => {
      setError(null);
      setSubmitting(true);

      const attachmentSummary =
        files.length > 0 ? `\n\n📎 ${files.map((f) => f.name).join(' · ')}` : '';

      const userMsg: UiMessage = {
        id: `temp-user-${Date.now()}`,
        role: 'user',
        content: text + attachmentSummary,
      };
      const assistantId = `temp-assistant-${Date.now()}`;
      const assistantMsg: UiMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        streaming: true,
      };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);

      let newConversationId: string | null = conversationId;

      try {
        const body = new FormData();
        body.append('message', text);
        if (conversationId) body.append('conversationId', conversationId);
        files.forEach((f) => body.append('files', f));

        const res = await fetch(endpoint, { method: 'POST', body });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({ error: 'حدث خطأ.' }));
          throw new Error(data.error ?? 'حدث خطأ في الخادم.');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const events = buffer.split('\n\n');
          buffer = events.pop() ?? '';

          for (const raw of events) {
            const lines = raw.split('\n');
            let type = 'message';
            let dataStr = '';
            for (const l of lines) {
              if (l.startsWith('event:')) type = l.slice(6).trim();
              else if (l.startsWith('data:')) dataStr += l.slice(5).trim();
            }
            if (!dataStr) continue;
            let payload: unknown;
            try {
              payload = JSON.parse(dataStr);
            } catch {
              continue;
            }

            if (type === 'meta' && typeof payload === 'object' && payload) {
              const p = payload as { conversationId?: string };
              if (p.conversationId && !newConversationId) {
                newConversationId = p.conversationId;
              }
            } else if (type === 'token' && typeof payload === 'string') {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId ? { ...m, content: m.content + payload } : m,
                ),
              );
            } else if (type === 'error' && typeof payload === 'object' && payload) {
              const p = payload as { error?: string };
              throw new Error(p.error ?? 'حدث خطأ أثناء التوليد.');
            } else if (type === 'done') {
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, streaming: false } : m)),
              );
            }
          }
        }

        if (newConversationId && newConversationId !== conversationId) {
          router.replace(`/${cfg.slug}/c/${newConversationId}`);
          router.refresh();
        } else {
          router.refresh();
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع.';
        setError(msg);
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } finally {
        setSubmitting(false);
      }
    },
    [conversationId, endpoint, cfg.slug, router],
  );

  return (
    <div className="relative flex h-full flex-col">
      <ScrollArea className="chat-scroll flex-1">
        {messages.length === 0 ? (
          <EmptyState mode={mode} />
        ) : (
          <>
            <MessageList messages={messages} />
            {error && (
              <div className="mx-auto my-4 flex max-w-3xl items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}
            <div ref={bottomRef} className="h-4" />
          </>
        )}
      </ScrollArea>
      <ChatInput
        placeholder={cfg.placeholder}
        submitting={submitting}
        onSubmit={submit}
        activeIntegrations={activeIntegrations}
        helperText={
          submitting
            ? 'جاري الإرسال…'
            : 'اضغط Enter للإرسال · Shift + Enter لسطر جديد · يقبل صور، PDF، و DOCX'
        }
      />
    </div>
  );
}

function EmptyState({ mode }: { mode: Mode }) {
  const cfg = getModeConfigByMode(mode);
  return (
    <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center p-8 text-center animate-fade-in">
      <div
        className={`mb-8 flex h-24 w-32 items-center justify-center rounded-3xl bg-gradient-to-br ${cfg.accent} text-canvas-base ${cfg.glow}`}
      >
        <WingsLogo size={40} tone="solid" className="text-canvas-base" />
      </div>
      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.03] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-ink-subtle">
        <span className="font-latin">{cfg.nameEn}</span>
        <span>·</span>
        <span>{cfg.nameAr}</span>
      </div>
      <h2 className="ds-wordmark mb-3 text-6xl">ملاكي</h2>
      <p className="max-w-sm text-pretty text-base leading-relaxed text-ink-muted">
        {cfg.tagline}
      </p>
    </div>
  );
}
