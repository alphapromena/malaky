import { AppShell } from '@/components/layout/AppShell';
import { DesignerStream } from '@/components/chat/DesignerStream';

export const dynamic = 'force-dynamic';

export default function DesignerPage() {
  return (
    <AppShell mode="DESIGNER">
      <DesignerStream conversationId={null} />
    </AppShell>
  );
}
