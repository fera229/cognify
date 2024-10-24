// app/(auth)/login/LoginForm.tsx
'use client';

import Image from 'next/image';
import LoginFormCard from './LoginFormCard';
import { getSafeReturnToPath } from '@/util/validation';

export default function LoginForm({ returnTo }: { returnTo: string }) {
  const safeReturnToPath = getSafeReturnToPath(returnTo) || '/';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      {/* Left side - Image */}
      <div className="relative flex justify-center lg:justify-start items-center order-2 lg:order-1">
        <div className="ml-10 max-w-lg">
          <Image
            src="/login.svg"
            alt="Illustration of a woman studying online."
            width={600}
            height={400}
            className="object-contain w-full h-auto"
            priority
          />
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full flex items-center justify-center order-1 lg:order-2 p-6 md:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <LoginFormCard returnTo={safeReturnToPath} />
        </div>
      </div>
    </div>
  );
}
