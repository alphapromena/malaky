import type { ReactNode } from 'react';
import { getSessionId } from '@/lib/session';

export default function AppLayout({ children }: { children: ReactNode }) {
  // Ensure session cookie is created on first protected-page visit.
  getSessionId();
  return <div className="h-screen overflow-hidden">{children}</div>;
}
