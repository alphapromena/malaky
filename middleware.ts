import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/', '/unlock'];
const PUBLIC_PREFIXES = ['/_next', '/api/unlock', '/api/session', '/favicon', '/icon', '/apple-icon'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.includes(pathname) || PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const unlocked = req.cookies.get('malaky_unlocked')?.value === 'true';

  if (!unlocked) {
    const url = req.nextUrl.clone();
    url.pathname = '/unlock';
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
