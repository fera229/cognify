'use client';

import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { LogOut, LogInIcon, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LogoutButton from '@/app/(auth)/logout/LogoutButton';

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.startsWith('/teacher');

  const isCourseContentPage = pathname?.includes('/chapter');

  return (
    <div className="flex gap-x-2 ml-auto">
      {/* ❌ user button should be added here later after finishing auth, so the user can logout among other things */}
      <Link href={'/login'}>
        <Button size={'sm'} variant={'ghost'}>
          <LogInIcon className="w-4 h-4 mr-2" />
          Login
        </Button>
      </Link>
      <Link href={'/register'}>
        <Button size={'sm'} variant={'ghost'}>
          <User className="w-4 h-4 mr-2" />
          Sign up
        </Button>
      </Link>
      <LogoutButton />
      {isTeacherPage || isCourseContentPage ? (
        <Link href={'/'}>
          <Button size={'sm'} variant={'ghost'}>
            <LogOut className="w-4 h-4 mr-2" />
            Exit
          </Button>
        </Link>
      ) : (
        <Link href={'/teacher/courses'}>
          <Button size={'sm'} variant={'ghost'} className="font-bold">
            Teacher Mode
          </Button>
        </Link>
      )}
    </div>
  );
};
