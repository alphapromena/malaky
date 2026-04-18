'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import Image from 'next/image';

export function Markdown({ children }: { children: string }) {
  return (
    <div className="max-w-none leading-[1.85]" dir="auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const inline = !className;
            const match = /language-(\w+)/.exec(className ?? '');
            if (inline) {
              return (
                <code
                  className="rounded-md border border-border bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.88em] text-gold-200"
                  dir="ltr"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <CodeBlock
                language={match?.[1] ?? ''}
                value={String(children).replace(/\n$/, '')}
              />
            );
          },
          a({ href, children, ...props }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-300 underline underline-offset-2 decoration-gold-400/40 hover:text-gold-200 hover:decoration-gold-300"
                {...props}
              >
                {children}
              </a>
            );
          },
          img({ src, alt }) {
            if (!src) return null;
            return (
              <span className="my-3 block overflow-hidden rounded-xl border border-border">
                <Image
                  src={src}
                  alt={alt ?? ''}
                  width={1024}
                  height={1024}
                  className="h-auto w-full"
                  unoptimized
                />
              </span>
            );
          },
          p: ({ children }) => (
            <p dir="auto" className="my-2.5 whitespace-pre-wrap leading-[1.85]">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul dir="auto" className="my-3 list-disc space-y-1.5 pe-5">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol dir="auto" className="my-3 list-decimal space-y-1.5 pe-5">
              {children}
            </ol>
          ),
          h1: ({ children }) => (
            <h1 dir="auto" className="my-4 text-2xl font-bold tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 dir="auto" className="my-3 text-xl font-semibold tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 dir="auto" className="my-2.5 text-lg font-semibold">
              {children}
            </h3>
          ),
          blockquote: ({ children }) => (
            <blockquote
              dir="auto"
              className="my-3 rounded-e-lg border-e-2 border-gold-400/60 bg-gold-400/5 ps-4 pe-3 py-2 text-ink-muted"
            >
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-4 border-border" />,
          table: ({ children }) => (
            <div dir="auto" className="my-3 overflow-x-auto rounded-lg border border-border">
              <table className="min-w-full text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b border-border bg-white/[0.04] px-3 py-2 text-start font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => <td className="border-t border-border px-3 py-2">{children}</td>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
