import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// These routes are always public
const publicRoutes = ['/', '/auth/login', '/auth/register', '/auth/verify', '/auth/callback'];

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.includes(pathname)) {
    // If user is logged in and tries to access auth pages, redirect to home
    if (session && pathname.startsWith('/auth/')) {
      return NextResponse.redirect(new URL('/home', request.url));
    }
    return res;
  }

  // For protected routes
  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Check email verification for protected routes
  if (!session.user.email_confirmed_at) {
    // Only allow access to verification page if email is not verified
    if (pathname !== '/auth/verify') {
      return NextResponse.redirect(new URL('/auth/verify', request.url));
    }
  }

  // If email is verified but user is on verify page, redirect to home
  if (session.user.email_confirmed_at && pathname === '/auth/verify') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 