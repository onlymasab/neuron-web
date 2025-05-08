import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function updateSession(request: NextRequest) {
  const cookies = request.cookies;

  // Create Supabase client
  const supabase = createSupabaseServerClient(cookies);

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If a user is found, you can set the user state in Zustand or pass user data to the client
  if (user) {
    // Pass the user to the client using props or other methods (cannot directly set Zustand store on server-side)
  }

  // If the user is not authenticated and not already on the home page, redirect to the home page
  // if (!user && request.nextUrl.pathname !== '/') {
  //   const url = request.nextUrl.clone();
  //   url.pathname = '/'; // Redirect to the home page
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}