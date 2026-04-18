'use client';

import Image from 'next/image';
import { Download, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type ImageItem = {
  id: string;
  arabic_prompt: string;
  english_prompt: string;
  image_url: string;
  created_at: string | null;
};

export function ImageResult({ image }: { image: ImageItem }) {
  async function download() {
    try {
      const res = await fetch(image.image_url);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `malaky-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      window.open(image.image_url, '_blank');
    }
  }

  return (
    <div className="mx-auto my-4 w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-white/[0.03] shadow-lg">
      <div className="relative aspect-square bg-black/40" dir="ltr">
        <Image
          src={image.image_url}
          alt={image.arabic_prompt}
          fill
          unoptimized
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
        />
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start gap-2">
          <ImageIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold-300" />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm font-medium leading-snug text-foreground">
              {image.arabic_prompt}
            </p>
            <p className="font-latin text-xs text-ink-subtle leading-relaxed" dir="ltr">
              {image.english_prompt}
            </p>
          </div>
        </div>
        <Button onClick={download} variant="outline" className="w-full gap-2">
          <Download className="h-4 w-4" />
          تنزيل الصورة
        </Button>
      </div>
    </div>
  );
}
