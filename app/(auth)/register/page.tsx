import React from 'react';
import RegisterFormCard from './register-form';
import { cookies } from 'next/headers';
import { getValidSession } from '@/database/session';
import { redirect } from 'next/navigation';

export default async function RegisterPage() {
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

  // 4. If the sessionToken cookie is invalid or doesn't exist, show the registration form

  return <RegisterFormCard />;
}
