'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CodeBlock({ language, value }: { language: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      className="group relative my-3 overflow-hidden rounded-xl border border-ink-700 bg-ink-900"
      dir="ltr"
    >
      <div className="flex items-center justify-between border-b border-ink-700 bg-ink-800 px-3 py-1.5">
        <span className="font-mono text-xs tracking-wide text-paper-50/60">
          {language || 'code'}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copy}
          className="h-7 gap-1.5 px-2 text-paper-50/70 hover:bg-white/10 hover:text-gold-300"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> تم النسخ
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> نسخ
            </>
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language || 'text'}
        style={vscDarkPlus}
        customStyle={{ margin: 0, background: 'transparent', fontSize: 13, padding: 16 }}
        PreTag="div"
      >
        {value}
      </SyntaxHighlighter>
    </div>
  );
}
