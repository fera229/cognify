import LoginFormCard from './LoginFormCard';
import { redirect } from 'next/navigation';
import { getSafeReturnToPath } from '@/util/validation';
import { checkIfSessionIsValid } from '@/database/users';

export type SearchParams = {
  returnTo: string | string[];
};

export default async function LoginPage(searchParams: SearchParams) {
  const sessionValid = await checkIfSessionIsValid();
  console.log('sessionValid:', sessionValid);
  if (sessionValid) {
    redirect(getSafeReturnToPath(searchParams.returnTo) || '/');
  }

  // 4. If the sessionToken cookie is invalid or doesn't exist, show the login form

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      {/* ❌ fix the searchParams problem, it's now a promise and should be awaited, future Next.js versions will not support accessing searchParams' properties directly. */}

      <LoginFormCard returnTo={searchParams.returnTo || '/'} />
    </div>
  );
}
