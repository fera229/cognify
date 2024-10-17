'use client';

import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { LogOut, LogInIcon, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import LogoutButton from '@/app/(auth)/logout/LogoutButton';
import { User } from '@/database/users';

type NavbarRoutesClientProps = {
  user: User | null;
};

export function NavbarRoutesClient({ user }: NavbarRoutesClientProps) {
  const pathname = usePathname();
  console.log('user: ', user);
  const isTeacherPage = pathname?.startsWith('/teacher');
  const isCourseContentPage = pathname?.includes('/chapter');
  const isInstructorMode = isTeacherPage || isCourseContentPage;

  return (
    <div className="flex items-center">
      <div className="flex gap-x-2">
        {!user ? (
          // User is not logged in
          <>
            <Link href={'/register'}>
              <Button size={'sm'} variant={'ghost'}>
                <UserIcon className="w-4 h-4 mr-2" />
                Sign up
              </Button>
            </Link>
            <Link href={'/login'}>
              <Button size={'sm'} variant={'ghost'}>
                <LogInIcon className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
          </>
        ) : (
          // User is logged in
          <>
            {user.role === 'Instructor' &&
              (isInstructorMode ? (
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
              ))}
            <LogoutButton />
          </>
        )}
      </div>
    </div>
  );
}
