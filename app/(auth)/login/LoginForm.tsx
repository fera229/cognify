// import { Rocket, Book, Users, GraduationCap } from 'lucide-react';
import LoginFormCard from './LoginFormCard';
import { getSafeReturnToPath } from '@/util/validation';

export default function LoginPage({
  params,
}: {
  params: { returnTo: string };
}) {
  const safeReturnToPath = getSafeReturnToPath(params?.returnTo) || '/';

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-cyan-100 to-blue-200 w-full ">
      {/* Left section with hero content */}
      <div className="flex flex-col justify-center items-start p-10 w-3/5 relative">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/50 to-blue-500/50 z-10" />
        <div className="flex items-center justify-center w-full">
          <div className="relative z-20 max-w-2xl">
            <h1 className="text-4xl font-bold mb-6 text-white">
              Welcome Back to Cognify
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Log in to continue your learning journey.
            </p>
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 lg:mt-12"> */}
            {/*   <div className="flex items-start space-x-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"> */}
            {/*     <div className="bg-cyan-100 p-2 rounded-lg shrink-0"> */}
            {/*       <Rocket className="h-6 w-6 text-cyan-600" /> */}
            {/*     </div> */}
            {/*     <div> */}
            {/*       <h3 className="font-semibold">Resume Your Courses</h3> */}
            {/*       <p className="text-slate-700 text-sm"> */}
            {/*         Pick up right where you left off */}
            {/*       </p> */}
            {/*     </div> */}
            {/*   </div> */}

            {/*   <div className="flex items-start space-x-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"> */}
            {/*     <div className="bg-blue-100 p-2 rounded-lg shrink-0"> */}
            {/*       <Book className="h-6 w-6 text-blue-600" /> */}
            {/*     </div> */}
            {/*     <div> */}
            {/*       <h3 className="font-semibold">Access Your Content</h3> */}
            {/*       <p className="text-slate-700 text-sm"> */}
            {/*         All your materials in one place */}
            {/*       </p> */}
            {/*     </div> */}
            {/*   </div> */}

            {/*   <div className="flex items-start space-x-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"> */}
            {/*     <div className="bg-indigo-100 p-2 rounded-lg shrink-0"> */}
            {/*       <Users className="h-6 w-6 text-indigo-600" /> */}
            {/*     </div> */}
            {/*     <div> */}
            {/*       <h3 className="font-semibold">Connect with Peers</h3> */}
            {/*       <p className="text-slate-700 text-sm"> */}
            {/*         Engage in discussions and collaborations */}
            {/*       </p> */}
            {/*     </div> */}
            {/*   </div> */}

            {/*   <div className="flex items-start space-x-4 p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"> */}
            {/*     <div className="bg-teal-100 p-2 rounded-lg shrink-0"> */}
            {/*       <GraduationCap className="h-6 w-6 text-teal-600" /> */}
            {/*     </div> */}
            {/*     <div> */}
            {/*       <h3 className="font-semibold">Track Your Progress</h3> */}
            {/*       <p className="text-slate-700 text-sm"> */}
            {/*         Monitor your achievements and growth */}
            {/*       </p> */}
            {/*     </div> */}
            {/*   </div> */}
            {/* </div> */}
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      {/* Right section with LoginFormCard */}
      <div className="flex flex-col justify-center items-center p-4 w-2/5 bg-slate-100/30 backdrop-blur-sm">
        <div className="w-full max-w-md">
          <LoginFormCard returnTo={safeReturnToPath} />
        </div>
      </div>
    </div>
  );
}
