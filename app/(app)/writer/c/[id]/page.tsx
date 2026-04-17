import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { ChatStream } from '@/components/chat/ChatStream';
import { getSessionId } from '@/lib/session';
import { listMessages } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function WriterConversationPage({ params }: { params: { id: string } }) {
  const sessionId = getSessionId();
  const messages = await listMessages(params.id, sessionId);
  if (!messages) notFound();

  return (
    <AppShell mode="WRITER">
      <ChatStream
        mode="WRITER"
        conversationId={params.id}
        initialMessages={messages.map((m) => ({ id: m.id, role: m.role, content: m.content }))}
      />
    </AppShell>
  );
}
