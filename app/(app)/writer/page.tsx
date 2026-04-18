import { AppShell } from '@/components/layout/AppShell';
import { ChatStream } from '@/components/chat/ChatStream';

export const dynamic = 'force-dynamic';

export default function WriterPage() {
  return (
    <AppShell mode="WRITER">
      <ChatStream mode="WRITER" conversationId={null} />
    </AppShell>
  );
}
