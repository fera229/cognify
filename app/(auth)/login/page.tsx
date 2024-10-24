// app/(auth)/login/page.tsx
import LoginForm from './LoginForm';
import { redirect } from 'next/navigation';
import { getSafeReturnToPath } from '@/util/validation';
import { checkIfSessionIsValid } from '@/database/users';
import { Suspense } from 'react';

interface PageProps {
  searchParams: Promise<{ returnTo?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  // Await the searchParams
  const params = await searchParams;

  const sessionValid = await checkIfSessionIsValid();
  console.log('sessionValid:', sessionValid);

  if (sessionValid) {
    redirect(getSafeReturnToPath(params?.returnTo) || '/');
  }

  // Ensure returnTo is a string
  const returnTo = typeof params?.returnTo === 'string' ? params.returnTo : '/';

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm returnTo={returnTo} />
      </Suspense>
    </div>
  );
}
