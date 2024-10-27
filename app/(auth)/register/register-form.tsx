import { Rocket, Book, Users, GraduationCap } from 'lucide-react';
import RegisterFormCard from './register-form-card';
import { getSafeReturnToPath } from '@/util/validation';

export default function RegisterForm({
  params,
}: {
  params: { returnTo: string };
}) {
  const safeReturnToPath = getSafeReturnToPath(params?.returnTo) || '/';

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-100 to-pink-100 overflow-hidden">
      {/* Left section with modern design */}
      <div className="hidden lg:flex flex-col justify-center items-start p-10 w-3/5 relative">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/50 to-pink-500/50 z-10" />
        <div className="flex items-center justify-center w-full">
          <div className="relative z-20 max-w-2xl">
            <h1 className="text-4xl font-bold mb-6 text-white">
              Welcome to Cognify
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Where Curious Minds Meet Their Mentors{' '}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 lg:mt-12">
              <div className="flex items-start space-x-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors">
                <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                  <Rocket className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Launch Your Course</h3>
                  <p className="text-slate-900 text-sm">
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
                  <p className="text-slate-900 text-sm">
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
                  <p className="text-slate-900 text-sm">
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
                  <p className="text-slate-900 text-sm">
                    and browse courses in a variety of disciplines
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm text-white/80">
                Already have an account?{' '}
                <a href="/login" className="text-white hover:underline">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
        {/* Illustration */}

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      </div>

      {/* Right section with RegisterFormCard */}
      <div className="flex flex-col justify-center items-center p-4 w-full lg:w-2/5 bg-white/30 backdrop-blur-sm">
        <RegisterFormCard returnTo={safeReturnToPath} />
      </div>
    </div>
  );
}
