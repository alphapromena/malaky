'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2 } from 'lucide-react';
import { ChatInput, type PrefillSignal } from './ChatInput';
import { ImageResult, type ImageItem } from './ImageResult';
import { WelcomeScreen } from './WelcomeScreen';
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
  const [prefill, setPrefill] = useState<PrefillSignal>({ text: '', id: 0 });
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
      <ScrollArea className="chat-scroll flex-1">
        {isEmpty ? (
          <WelcomeScreen
            mode="DESIGNER"
            onPick={(text) => setPrefill((p) => ({ text, id: p.id + 1 }))}
          />
        ) : (
          <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
            <ul className="space-y-7">
              {prompts.map((p, idx) => (
                <li key={p.id} className="space-y-3 animate-fade-in">
                  <div className="rounded-2xl border border-border bg-white/[0.03] px-5 py-4 text-sm">
                    <div className="mb-1 text-[11px] font-medium text-ink-muted">أنت</div>
                    <p className="whitespace-pre-wrap leading-relaxed">{p.arabic_prompt}</p>
                  </div>
                  {images[idx] && <ImageResult image={images[idx]!} />}
                </li>
              ))}
              {submitting && (
                <li className="flex items-center gap-3 rounded-2xl border border-terracotta-400/25 bg-terracotta-400/5 px-5 py-4 text-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-gold-300" />
                  <span className="text-ink-muted">جاري توليد الصورة…</span>
                  <span className="ms-auto text-[11px] text-ink-subtle">~30 ثانية</span>
                </li>
              )}
            </ul>
            {error && (
              <div className="my-4 flex items-start gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
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
        onSubmit={(text) => submit(text)}
        allowAttachments={false}
        prefill={prefill}
        helperText={
          submitting
            ? 'جاري التوليد…'
            : 'اضغط Enter للتوليد · نصائح: صف العناصر، الألوان، والأسلوب الفني'
        }
      />
    </div>
  );
}
