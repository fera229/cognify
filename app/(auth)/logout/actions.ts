'use server';

import { deleteSession } from '@/database/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logout() {
  // 1. Get the session token from the cookie() function

  const cookieStore = await cookies();

  const sessionToken = cookieStore.get('sessionToken');

  // 2. If the session token exists, delete the session

  if (sessionToken) await deleteSession(sessionToken.value);

  // 3. Remove the session token from the browser

  cookieStore.delete('sessionToken');

  redirect('/login');
}
