import type { ReactNode } from 'react';
import { requireAuthUser } from '@/lib/auth';

export default async function AppLayout({ children }: { children: ReactNode }) {
  // Auth gate for everything under (app). Chat pages compose their own
  // full-height shell (AppShell); settings pages scroll normally.
  await requireAuthUser();
  return <>{children}</>;
}
