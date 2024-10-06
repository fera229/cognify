import { cookies } from 'next/headers';
import LoginFormCard from './LoginFormCard';
import { getValidSession } from '@/database/session';
import { redirect } from 'next/navigation';
import { getSafeReturnToPath } from '@/util/validation';

export type SearchParams = {
  returnTo: string | string[];
};

export default async function LoginPage(searchParams: SearchParams) {
  // Task: Add redirect to home if user is logged in
  // 1. Checking if the sessionToken cookie exists
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('sessionToken');
  // 2. Check if the sessionToken cookie is still valid

  // 3. If the sessionToken cookie is valid, redirect to home
  const validSession =
    sessionToken && (await getValidSession(sessionToken?.value));

  if (validSession) {
    redirect('/');
  }

  // 4. If the sessionToken cookie is invalid or doesn't exist, show the login form

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      {/* ❌ fix the searchParams problem, it's now a promise and should be awaited, future Next.js versions will not support accessing searchParams' properties directly. */}

      <LoginFormCard
        returnTo={getSafeReturnToPath(searchParams.returnTo) || '/'}
      />
    </div>
  );
}
