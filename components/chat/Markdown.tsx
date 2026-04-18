'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import Image from 'next/image';

export function Markdown({ children }: { children: string }) {
  return (
    <div className="max-w-none leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const inline = !className;
            const match = /language-(\w+)/.exec(className ?? '');
            if (inline) {
              return (
                <code
                  className="rounded-sm bg-paper-200 px-1.5 py-0.5 font-mono text-[0.88em] text-ink-800 border border-border"
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
                className="text-gold-700 underline underline-offset-2 decoration-gold-300 hover:decoration-gold-500"
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
            <p className="my-2 whitespace-pre-wrap leading-[1.75]">{children}</p>
          ),
          ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pe-5">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pe-5">{children}</ol>,
          h1: ({ children }) => <h1 className="my-3 text-xl font-bold">{children}</h1>,
          h2: ({ children }) => <h2 className="my-3 text-lg font-semibold">{children}</h2>,
          h3: ({ children }) => <h3 className="my-2 text-base font-semibold">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="my-3 border-e-2 border-gold-400 bg-gold-50/60 ps-4 pe-3 py-2 text-fg-muted italic">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-4 border-border" />,
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto">
              <table className="min-w-full text-sm border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-border bg-paper-200 px-3 py-1.5 text-start font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => <td className="border border-border px-3 py-1.5">{children}</td>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
