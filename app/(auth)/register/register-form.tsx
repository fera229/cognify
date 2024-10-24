import { Rocket, Book, Users, GraduationCap } from 'lucide-react';
import Image from 'next/image';
import RegisterFormCard from './register-form-card';
import * as z from 'zod';
import { getSafeReturnToPath, registerSchema } from '@/util/validation';

export default function RegisterForm({
  params,
}: {
  params: { returnTo: string };
}) {
  const safeReturnToPath = getSafeReturnToPath(params?.returnTo) || '/';

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-10">
      {/* Left side - Hero section */}
      <div className="flex flex-col justify-between bg-slate-50 p-6 md:p-8 lg:p-12 col-span-6 order-2 lg:order-1">
        <div className="space-y-6 md:space-y-8">
          <div className="text-center mt-10 pt-10m          ">
            <h1 className="text-3xl md:text-4xl font-bold mt-6 lg:mt-10">
              Start Your Teaching Journey Today with Cognify
            </h1>
            <p className="text-slate-600 text-base md:text-lg mt-4">
              Join our community of educators and share your knowledge with
              students worldwide.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative flex justify-center lg:justify-start mt-8 lg:mt-auto mx-auto lg:mx-0 w-full max-w-lg">
              <Image
                src="/registration.svg"
                alt="Illustration of a woman studying online."
                width={600}
                height={400}
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Feature grid */}
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 lg:mt-12 ">
              <div className="flex items-start space-x-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                  <Rocket className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Launch Your Course</h3>
                  <p className="text-slate-500 text-sm">
                    Create and publish courses with ease
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                <div className="bg-green-100 p-2 rounded-lg shrink-0">
                  <Book className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Flexible Content</h3>
                  <p className="text-slate-500 text-sm">
                    Structure your content your way
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                <div className="bg-purple-100 p-2 rounded-lg shrink-0">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Global Reach</h3>
                  <p className="text-slate-500 text-sm">
                    Connect with students worldwide
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                <div className="bg-red-100 p-2 rounded-lg shrink-0">
                  <GraduationCap className="h-6 w-6 text-red-700" />
                </div>
                <div>
                  <h3 className="font-semibold">Register as a student</h3>
                  <p className="text-slate-500 text-sm">
                    and browse courses in a variety of disciplines
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Illustration container */}
      </div>

      {/* Right side - Registration form (1/3) */}
      <div className="col-span-4 w-full flex items-center justify-center p-6 md:p-8 lg:p-12 order-1 lg:order-2">
        <div className="w-full max-w-md">
          <RegisterFormCard returnTo={safeReturnToPath} />
        </div>
      </div>
    </div>
  );
}
