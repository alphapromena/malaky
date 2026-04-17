import { AppShell } from '@/components/layout/AppShell';
import { ChatStream } from '@/components/chat/ChatStream';

export const dynamic = 'force-dynamic';

export default function CoderPage() {
  return (
    <AppShell mode="CODER">
      <ChatStream mode="CODER" conversationId={null} />
    </AppShell>
  );
}
