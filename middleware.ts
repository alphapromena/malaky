import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

const PUBLIC_PATHS = new Set<string>(['/', '/login', '/signup', '/signup/check-email', '/terms', '/privacy']);
const PUBLIC_PREFIXES = ['/_next', '/auth/callback', '/api/auth', '/favicon', '/icon', '/apple-icon', '/brand'];
const AUTH_ONLY_PATHS = new Set<string>(['/login', '/signup', '/signup/check-email']);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Refresh Supabase session cookies on every request.
  const { response, user } = await updateSession(req);

  const isPublic =
    PUBLIC_PATHS.has(pathname) || PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  // Signed-in users shouldn't see the login/signup screens (unless completing profile)
  if (user && AUTH_ONLY_PATHS.has(pathname)) {
    const url = req.nextUrl.clone();
    if (pathname === '/signup' && req.nextUrl.searchParams.get('complete') === '1') {
      return response;
    }
    url.pathname = '/writer';
    url.search = '';
    return NextResponse.redirect(url);
  }

  // Signed-out users trying to reach protected routes
  if (!isPublic && !user) {
    // API routes get a clean 401 JSON so clients can handle it; pages redirect.
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول.' },
        { status: 401, headers: { 'WWW-Authenticate': 'Bearer' } },
      );
    }
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
