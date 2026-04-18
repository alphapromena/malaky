import type { ReactNode } from 'react';
import { requireAuthUser } from '@/lib/auth';

export default async function AppLayout({ children }: { children: ReactNode }) {
  await requireAuthUser();
  return <div className="h-screen overflow-hidden">{children}</div>;
}
