import React from 'react';
import { cookies } from 'next/headers';
import { getValidSession } from '@/database/session';
import { redirect } from 'next/navigation';
import { getSafeReturnToPath } from '@/util/validation';
import RegisterForm from './register-form';

interface PageProps {
  searchParams: Promise<{ returnTo?: string }>;
}

export default async function RegisterPage({ searchParams }: PageProps) {
  try {
    // Check if sessionToken cookie exists
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('sessionToken');

    // Check if the sessionToken is valid
    const validSession =
      sessionToken && (await getValidSession(sessionToken?.value));

    const searchParamsAwaited = await searchParams;

    if (validSession) {
      redirect(getSafeReturnToPath(searchParamsAwaited?.returnTo) || '/');
    }

    // Pass the returnTo parameter to the registration form
    const safeReturnToPath =
      getSafeReturnToPath(searchParamsAwaited.returnTo) || '/';

    return <RegisterForm params={{ returnTo: safeReturnToPath }} />;
  } catch (error) {
    console.error('Error in RegisterPage:', error);
    return <div>An error occurred. Please try again later.</div>;
  }
}
