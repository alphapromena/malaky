import { notFound } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { ChatStream } from '@/components/chat/ChatStream';
import { requireAuthUser } from '@/lib/auth';
import { getServerClient } from '@/lib/supabase/server';
import { listMessages } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function WriterConversationPage({ params }: { params: { id: string } }) {
  const { user } = await requireAuthUser();
  const supabase = getServerClient();
  const messages = await listMessages(supabase, params.id, user.id);
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
