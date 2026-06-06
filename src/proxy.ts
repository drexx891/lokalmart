import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import type { SessionData } from '@/lib/auth';

export async function proxy(request: NextRequest) {
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

  // Protect Admin Routes
  if (path.startsWith('/admin')) {
    if (path === '/admin/login') {
      // If already logged in as admin, redirect to admin dashboard
      if (session.isLoggedIn && session.role === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return response; // allow access to login page
    }

    // Require admin role for all other /admin routes
    if (!session.isLoggedIn || session.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect Customer/Seller Routes
  const protectedRoutes = ['/keranjang', '/pesan', '/profil', '/seller'];
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));

  if (isProtectedRoute && !session.isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/keranjang/:path*', '/pesan/:path*', '/profil/:path*', '/seller/:path*'],
};

