import { getValidSession } from '@/database/session';
import { cookies } from 'next/headers';

export const secureCookieOptions = {
  maxAge: 60 * 60 * 24, // 24 hours
  httpOnly: true,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax', // CSRF protection
} as const;

export const checkValidSession = async (): Promise<Boolean> => {
  // Task: Add redirect to home if user is logged in
  // 1. Checking if the sessionToken cookie exists
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('sessionToken');
  // 2. Check if the sessionToken cookie is still valid

  // 3. If the sessionToken cookie is valid, redirect to home
  const validSession =
    sessionToken && (await getValidSession(sessionToken?.value));
  if (validSession) {
    return !!validSession;
  }
  return false;
};
