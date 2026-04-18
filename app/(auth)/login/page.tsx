import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { LoginForm } from '@/components/auth/LoginForm';
import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const auth = await getAuthUser();
  if (auth?.profile) redirect('/writer');

  return (
    <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-ink-muted" />}>
      <LoginForm />
    </Suspense>
  );
}
