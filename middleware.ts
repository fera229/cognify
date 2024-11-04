import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get session token from cookies
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('sessionToken')?.value;

  // Add session token to headers if available
  if (sessionToken) {
    response.headers.set('x-session-token', sessionToken);
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
