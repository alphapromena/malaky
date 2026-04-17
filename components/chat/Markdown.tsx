'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import Image from 'next/image';

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-sm max-w-none leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const inline = !className;
            const match = /language-(\w+)/.exec(className ?? '');
            if (inline) {
              return (
                <code
                  className="rounded bg-muted px-1.5 py-0.5 font-inter text-[0.9em]"
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
                className="text-accent underline underline-offset-2 hover:text-accent/80"
                {...props}
              >
                {children}
              </a>
            );
          },
          img({ src, alt }) {
            if (!src) return null;
            return (
              <span className="my-3 block overflow-hidden rounded-lg border">
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
          p: ({ children }) => <p className="my-2 whitespace-pre-wrap">{children}</p>,
          ul: ({ children }) => <ul className="my-2 list-disc space-y-1 pe-5">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 list-decimal space-y-1 pe-5">{children}</ol>,
          h1: ({ children }) => <h1 className="my-3 text-xl font-bold">{children}</h1>,
          h2: ({ children }) => <h2 className="my-3 text-lg font-bold">{children}</h2>,
          h3: ({ children }) => <h3 className="my-2 text-base font-semibold">{children}</h3>,
          blockquote: ({ children }) => (
            <blockquote className="my-2 border-e-2 border-accent bg-muted/40 pe-3 ps-4 py-2 text-muted-foreground">
              {children}
            </blockquote>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
