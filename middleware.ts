import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/unlock'];
const PUBLIC_PREFIXES = ['/_next', '/api/unlock', '/api/session', '/favicon', '/icon', '/apple-icon'];

const THIRTY_DAYS = 60 * 60 * 24 * 30;
const SESSION_COOKIE = 'malaky_session';
const UNLOCK_COOKIE = 'malaky_unlocked';

function generateSessionId(): string {
  // Edge runtime supports crypto.randomUUID
  return crypto.randomUUID();
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic =
    PUBLIC_PATHS.includes(pathname) || PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));

  // Unlock gate
  if (!isPublic) {
    const unlocked = req.cookies.get(UNLOCK_COOKIE)?.value === 'true';
    if (!unlocked) {
      const url = req.nextUrl.clone();
      url.pathname = '/unlock';
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }
  }

  const res = NextResponse.next();

  // Issue a session cookie if missing, on every non-static request
  const hasSession = req.cookies.get(SESSION_COOKIE)?.value;
  if (!hasSession) {
    res.cookies.set(SESSION_COOKIE, generateSessionId(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: THIRTY_DAYS,
    });
  }

  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
