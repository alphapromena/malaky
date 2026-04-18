import { NextResponse, type NextRequest } from 'next/server';
import { getServerClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') ?? '/writer';

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', req.url));
  }

  const supabase = getServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, req.url),
    );
  }

  // After OAuth, ensure a profile exists; if not, send to /signup?complete=1
  const { data: userRes } = await supabase.auth.getUser();
  if (userRes.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userRes.user.id)
      .maybeSingle();
    if (!profile) {
      return NextResponse.redirect(
        new URL(`/signup?complete=1&next=${encodeURIComponent(next)}`, req.url),
      );
    }
  }

  return NextResponse.redirect(new URL(next, req.url));
}
