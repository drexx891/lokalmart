import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import type { SessionData } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getIronSession<SessionData>(request, response, {
    password: process.env.SECRET_COOKIE_PASSWORD || "complex_password_at_least_32_characters_long_for_iron_session",
    cookieName: "lokalmart_session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    },
  });

  const path = request.nextUrl.pathname;

  const protectedRoutes = ['/admin', '/keranjang', '/pesan', '/profil'];
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  if (isProtectedRoute && !session.isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin/Supplier role check
  if (path.startsWith('/admin') && session.role !== 'supplier') {
    // Let the layout handle the "Not a supplier" screen, or redirect
    // We will just let it pass, and `admin/layout.tsx` will show the upgrade screen.
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/keranjang/:path*', '/pesan/:path*', '/profil/:path*'],
};
