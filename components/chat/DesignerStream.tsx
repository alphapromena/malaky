'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, Palette } from 'lucide-react';
import { ChatInput } from './ChatInput';
import { ImageResult, type ImageItem } from './ImageResult';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getModeConfigByMode } from '@/lib/modes';

export function DesignerStream({
  conversationId,
  initialImages,
  initialPrompts,
}: {
  conversationId: string | null;
  initialImages?: ImageItem[];
  initialPrompts?: Array<{ id: string; arabic_prompt: string }>;
}) {
  const cfg = getModeConfigByMode('DESIGNER');
  const router = useRouter();
  const [images, setImages] = useState<ImageItem[]>(initialImages ?? []);
  const [prompts, setPrompts] = useState<Array<{ id: string; arabic_prompt: string }>>(
    initialPrompts ?? [],
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [images, submitting]);

  const submit = useCallback(
    async (prompt: string) => {
      setError(null);
      setSubmitting(true);
      const tempPromptId = `temp-prompt-${Date.now()}`;
      setPrompts((p) => [...p, { id: tempPromptId, arabic_prompt: prompt }]);

      try {
        const res = await fetch('/api/designer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, conversationId }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? 'فشل توليد الصورة.');
        }
        const newImage = data.image as ImageItem;
        const newConvId = data.conversationId as string;
        setImages((prev) => [...prev, newImage]);
        if (!conversationId && newConvId) {
          router.replace(`/designer/c/${newConvId}`);
        }
        router.refresh();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع.';
        setError(msg);
        setPrompts((p) => p.filter((x) => x.id !== tempPromptId));
      } finally {
        setSubmitting(false);
      }
    },
    [conversationId, router],
  );

  const isEmpty = images.length === 0 && prompts.length === 0;

  return (
    <div className="flex h-full flex-col bg-paper-100">
      <ScrollArea className="chat-scroll flex-1">
        {isEmpty ? (
          <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center p-8 text-center">
            <div
              className={`mb-5 rounded-2xl bg-gradient-to-bl ${cfg.accent} p-5 text-paper-50 shadow-lg`}
            >
              <Palette className="h-8 w-8" />
            </div>
            <h2 className="ds-display mb-2 text-3xl">{cfg.nameAr}</h2>
            <p className="mb-8 max-w-sm text-pretty text-base text-fg-muted leading-relaxed">
              {cfg.tagline}
            </p>
            <div className="text-xs text-fg-subtle">اكتب وصف الصورة بالعربي في الأسفل</div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-3xl px-3 py-6 sm:px-6">
            <ul className="space-y-6">
              {prompts.map((p, idx) => (
                <li key={p.id} className="space-y-3 animate-fade-in">
                  <div className="rounded-xl border border-ink-900/10 bg-ink-900/[0.04] px-4 py-3 text-sm">
                    <div className="mb-1 text-xs font-medium text-fg-subtle">أنت</div>
                    <p className="whitespace-pre-wrap leading-relaxed">{p.arabic_prompt}</p>
                  </div>
                  {images[idx] && <ImageResult image={images[idx]!} />}
                </li>
              ))}
              {submitting && (
                <li className="flex items-center gap-3 rounded-xl border border-border bg-paper-50 px-4 py-3 text-sm text-fg-muted shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-gold-500" />
                  جاري توليد الصورة… قد يستغرق هذا حتى 30 ثانية
                </li>
              )}
            </ul>
            {error && (
              <div className="my-4 flex items-start gap-2 rounded-lg border border-danger-500/30 bg-danger-100/70 p-3 text-sm text-danger-500">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </ScrollArea>
      <ChatInput
        placeholder={cfg.placeholder}
        submitting={submitting}
        onSubmit={submit}
        helperText={
          submitting
            ? 'جاري التوليد…'
            : 'نصائح: صف العناصر، الألوان، المشاعر، والأسلوب الفني — كلما كان الوصف أدق، كانت الصورة أحسن'
        }
      />
    </div>
  );
}
