import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import { SignupForm } from '@/components/auth/SignupForm';
import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { complete?: string; next?: string };
}) {
  const auth = await getAuthUser();
  const completeProfile = searchParams.complete === '1';

  // If already have a complete profile, skip signup
  if (auth?.profile) redirect(searchParams.next ?? '/writer');
  // If signed-in but no profile AND we're not in complete mode, force complete
  if (auth && !auth.profile && !completeProfile) {
    redirect('/signup?complete=1');
  }

  return (
    <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-ink-muted" />}>
      <SignupForm />
    </Suspense>
  );
}
