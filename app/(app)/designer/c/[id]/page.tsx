import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { DesignerStream } from '@/components/chat/DesignerStream';
import { getSessionId } from '@/lib/session';
import { listImages, listMessages } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function DesignerConversationPage({ params }: { params: { id: string } }) {
  const sessionId = getSessionId();
  const messages = await listMessages(params.id, sessionId);
  if (!messages) notFound();
  const images = (await listImages(params.id, sessionId)) ?? [];

  const userPrompts = messages
    .filter((m) => m.role === 'user')
    .map((m) => ({ id: m.id, arabic_prompt: m.content }));

  return (
    <AppShell mode="DESIGNER">
      <DesignerStream
        conversationId={params.id}
        initialImages={images.map((i) => ({
          id: i.id,
          arabic_prompt: i.arabic_prompt,
          english_prompt: i.english_prompt,
          image_url: i.image_url,
          created_at: i.created_at,
        }))}
        initialPrompts={userPrompts}
      />
    </AppShell>
  );
}
