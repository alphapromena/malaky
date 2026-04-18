'use client';

import { useRef, useState, type KeyboardEvent, type ChangeEvent } from 'react';
import Link from 'next/link';
import {
  FileText,
  Image as ImageIcon,
  Loader2,
  Paperclip,
  Plug,
  Send,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export type AttachmentFile = File;

export const ACCEPTED_MIMES =
  'image/png,image/jpeg,image/webp,image/gif,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
export const MAX_FILE_BYTES = 20 * 1024 * 1024;
export const MAX_FILES = 5;

export type ActiveIntegration = { id: string; name: string; nameAr: string };

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIconFor(file: File) {
  if (file.type.startsWith('image/')) return ImageIcon;
  return FileText;
}

export function ChatInput({
  placeholder,
  disabled,
  onSubmit,
  submitting,
  helperText,
  allowAttachments = true,
  activeIntegrations = [],
}: {
  placeholder: string;
  disabled?: boolean;
  onSubmit: (text: string, files: AttachmentFile[]) => void | Promise<void>;
  submitting: boolean;
  helperText?: string;
  allowAttachments?: boolean;
  activeIntegrations?: ActiveIntegration[];
}) {
  const [value, setValue] = useState('');
  const [files, setFiles] = useState<AttachmentFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      fire();
    }
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFileError(null);
    const incoming = Array.from(list);
    const next = [...files];
    for (const f of incoming) {
      if (next.length >= MAX_FILES) {
        setFileError(`الحد الأقصى ${MAX_FILES} ملفات في الرسالة الواحدة.`);
        break;
      }
      if (f.size > MAX_FILE_BYTES) {
        setFileError(`«${f.name}» حجمه أكبر من ${humanSize(MAX_FILE_BYTES)}.`);
        continue;
      }
      next.push(f);
    }
    setFiles(next);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  function fire() {
    const trimmed = value.trim();
    if ((!trimmed && files.length === 0) || submitting) return;
    onSubmit(trimmed, files);
    setValue('');
    setFiles([]);
    setFileError(null);
    textareaRef.current?.focus();
  }

  const canSubmit = !submitting && !disabled && (value.trim().length > 0 || files.length > 0);

  return (
    <div className="border-t border-border bg-canvas-elevated/40 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-3xl p-3 sm:p-5">
        {activeIntegrations.length > 0 && (
          <div className="mb-2 flex flex-wrap items-center justify-center gap-1.5">
            <span className="text-[10px] uppercase tracking-[0.18em] text-ink-subtle">
              التكاملات النشطة:
            </span>
            {activeIntegrations.map((i) => (
              <Link
                key={i.id}
                href={`/settings/integrations/${i.id}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 px-2.5 py-0.5 text-[11px] font-medium text-gold-200 transition-colors hover:bg-gold-400/20"
              >
                <Plug className="h-3 w-3" />
                {i.nameAr}
              </Link>
            ))}
          </div>
        )}

        <div
          className={cn(
            'group relative flex flex-col gap-2 rounded-2xl border border-border bg-white/[0.04] p-2.5 transition-all duration-normal ease-out',
            'focus-within:border-gold-400/60 focus-within:bg-white/[0.06] focus-within:shadow-[0_0_0_4px_rgba(184,149,106,0.15)]',
            disabled && 'opacity-60',
          )}
        >
          {files.length > 0 && (
            <ul className="flex flex-wrap gap-2 px-1 pt-1" aria-label="المرفقات">
              {files.map((f, i) => {
                const Icon = fileIconFor(f);
                return (
                  <li
                    key={`${f.name}-${i}`}
                    className="flex items-center gap-2 rounded-lg border border-border bg-canvas-raised px-2.5 py-1.5 text-xs"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gold-400/15 text-gold-300">
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="max-w-[10rem] truncate font-latin" dir="ltr" title={f.name}>
                      {f.name}
                    </span>
                    <span className="text-ink-subtle">{humanSize(f.size)}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="ms-1 rounded-md p-0.5 text-ink-subtle transition-colors hover:bg-white/10 hover:text-foreground"
                      aria-label={`إزالة ${f.name}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex items-end gap-2">
            {allowAttachments && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ACCEPTED_MIMES}
                  multiple
                  hidden
                  onChange={(e: ChangeEvent<HTMLInputElement>) => addFiles(e.target.files)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 shrink-0 rounded-xl"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={submitting || disabled || files.length >= MAX_FILES}
                  aria-label="إرفاق ملف"
                  title="إرفاق صورة أو PDF أو DOCX"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </>
            )}

            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKey}
              placeholder={placeholder}
              className="min-h-[44px] max-h-[220px] resize-none border-0 bg-transparent px-1 py-2 shadow-none focus:shadow-none focus:border-0 focus:ring-0"
              rows={1}
              disabled={disabled || submitting}
              dir="auto"
            />

            <Button
              onClick={fire}
              disabled={!canSubmit}
              size="icon"
              className="h-10 w-10 shrink-0 rounded-xl"
              aria-label="إرسال"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {fileError && (
          <p className="mt-2 text-center text-[11px] text-danger">{fileError}</p>
        )}

        <p className="mt-2.5 text-center text-[11px] text-ink-subtle">
          {helperText ??
            'اضغط Enter للإرسال · Shift + Enter لسطر جديد · يقبل صور، PDF، و DOCX'}
        </p>
      </div>
    </div>
  );
}
