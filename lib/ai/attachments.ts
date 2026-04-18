import mammoth from 'mammoth';
import type Anthropic from '@anthropic-ai/sdk';

export const SUPPORTED_IMAGE_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
]);

export const PDF_MIME = 'application/pdf';
export const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

export const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20 MB
export const MAX_FILES = 5;

export type ProcessedAttachment =
  | {
      kind: 'image';
      name: string;
      block: Anthropic.ImageBlockParam;
    }
  | {
      kind: 'document';
      name: string;
      block: Anthropic.DocumentBlockParam;
    }
  | {
      kind: 'text';
      name: string;
      text: string; // extracted text from DOCX
    };

export function isSupportedAttachment(file: File): boolean {
  return (
    SUPPORTED_IMAGE_MIMES.has(file.type) ||
    file.type === PDF_MIME ||
    file.type === DOCX_MIME
  );
}

export async function processAttachment(file: File): Promise<ProcessedAttachment> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error(`الملف «${file.name}» أكبر من الحد المسموح (20MB).`);
  }

  const buf = Buffer.from(await file.arrayBuffer());

  if (SUPPORTED_IMAGE_MIMES.has(file.type)) {
    const mediaType = (file.type === 'image/jpg' ? 'image/jpeg' : file.type) as
      | 'image/png'
      | 'image/jpeg'
      | 'image/webp'
      | 'image/gif';
    return {
      kind: 'image',
      name: file.name,
      block: {
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: buf.toString('base64'),
        },
      },
    };
  }

  if (file.type === PDF_MIME) {
    return {
      kind: 'document',
      name: file.name,
      block: {
        type: 'document',
        source: {
          type: 'base64',
          media_type: 'application/pdf',
          data: buf.toString('base64'),
        },
      },
    };
  }

  if (file.type === DOCX_MIME) {
    const { value } = await mammoth.extractRawText({ buffer: buf });
    const text = value.trim();
    if (!text) {
      throw new Error(`تعذّر قراءة نص الملف «${file.name}».`);
    }
    return { kind: 'text', name: file.name, text };
  }

  throw new Error(`نوع الملف غير مدعوم: ${file.type || 'مجهول'}`);
}

/**
 * Build a Claude user `content` array from a text message + processed files.
 * Order: image/document blocks first, then a final text block containing the
 * user's message (with any DOCX-extracted text appended).
 */
export function buildUserContent(
  userText: string,
  attachments: ProcessedAttachment[],
): string | Anthropic.ContentBlockParam[] {
  if (attachments.length === 0) return userText;

  const blocks: Anthropic.ContentBlockParam[] = [];
  const docxSnippets: string[] = [];

  for (const a of attachments) {
    if (a.kind === 'image' || a.kind === 'document') {
      blocks.push(a.block);
    } else {
      // DOCX → merge as text
      docxSnippets.push(
        `محتوى الملف «${a.name}»:\n"""\n${a.text.slice(0, 20_000)}\n"""`,
      );
    }
  }

  const textParts: string[] = [];
  if (userText.trim()) textParts.push(userText.trim());
  if (docxSnippets.length) textParts.push(docxSnippets.join('\n\n'));

  blocks.push({ type: 'text', text: textParts.join('\n\n') || 'حلّل المرفقات.' });
  return blocks;
}

export function attachmentsSummary(names: string[]): string {
  if (!names.length) return '';
  return `\n\n[مرفقات: ${names.join(' · ')}]`;
}
