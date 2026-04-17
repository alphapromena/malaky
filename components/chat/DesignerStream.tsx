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
    <div className="flex h-full flex-col">
      <ScrollArea className="flex-1 chat-scroll">
        {isEmpty ? (
          <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center p-8 text-center">
            <div
              className={`mb-4 rounded-full bg-gradient-to-br ${cfg.accent} p-4 text-white shadow-lg`}
            >
              <Palette className="h-8 w-8" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">{cfg.nameAr}</h2>
            <p className="mb-6 text-muted-foreground text-balance">{cfg.tagline}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3" />
              اكتب وصف الصورة بالعربي في الأسفل
            </div>
          </div>
        ) : (
          <div className="mx-auto w-full max-w-3xl px-3 py-6 sm:px-6">
            <ul className="space-y-6">
              {prompts.map((p, idx) => (
                <li key={p.id} className="space-y-3">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm">
                    <div className="mb-1 text-xs font-medium text-muted-foreground">أنت</div>
                    <p className="whitespace-pre-wrap">{p.arabic_prompt}</p>
                  </div>
                  {images[idx] && <ImageResult image={images[idx]!} />}
                </li>
              ))}
              {submitting && (
                <li className="flex items-center gap-3 rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري توليد الصورة… قد يستغرق هذا حتى 30 ثانية
                </li>
              )}
            </ul>
            {error && (
              <div className="my-4 flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
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
