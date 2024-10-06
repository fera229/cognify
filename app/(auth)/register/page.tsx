import React from 'react';
import RegisterFormCard from './register-form';
// import { Props } from '../login/page';

export default function RegisterPage() {
  {
    /* fix the searchParams problem, it's now a promise and should be awaited, future Next.js versions will not support accessing searchParams' properties directly. */
  }
  // return <RegisterFormCard returnTo={props.searchParams.returnTo} />;
  return <RegisterFormCard />;
}
