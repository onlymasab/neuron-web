// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Initialize Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: { [key: string]: any }) {
          request.cookies.set({ name, value, ...options });
        },
        remove(name: string) {
          request.cookies.delete(name);
        },
      },
    }
  );

  // Get and refresh session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Handle auth callback route (for email confirmation)
  if (request.nextUrl.pathname.startsWith('/auth/callback')) {
    const code = request.nextUrl.searchParams.get('code');
    if (code) {
      // Exchange code for session
      await supabase.auth.exchangeCodeForSession(code);
    }
    // Redirect to profile or home after handling callback
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  // Protect routes
  const protectedRoutes = ['/profile', '/dashboard'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !session) {
    // Redirect unauthenticated users to login
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Optional: Role-based access control (example)
  // Assumes you have a 'role' field in your Supabase user_metadata
  if (request.nextUrl.pathname.startsWith('/admin') && session) {
    const { data: user } = await supabase.auth.getUser();
    const role = user.user?.user_metadata?.role;
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Allow request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/dashboard/:path*',
    '/auth/callback',
    '/admin/:path*',
  ],
};