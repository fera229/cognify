'use client';

import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import Link from 'next/link';

export const NavbarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith('/teacher');

  const isCourseContentPage = pathname?.includes('/chapter');

  return (
    <div className="flex gap-x-2 ml-auto">
      {/* ❌ user button should be added here later after finishing auth, so the user can logout among other things */}

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
