'use client';

import type { User } from '@/database/users';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, Gauge, Layout, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import LogoutButton from '@/app/(auth)/logout/LogoutButton';
import ProfileButton from './profile-button';

interface UserNavMenuProps {
  user: User;
}

const UserNavMenu = ({ user }: UserNavMenuProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith('/teacher');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 flex items-center gap-2 pl-8"
        >
          <UserIcon className="w-5 h-5 absolute left-2 top-1/2 transform -translate-y-1/2" />
          {user.name}
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.role === 'Instructor' && (
          <div className="h-full">
            <DropdownMenuItem asChild>
              <Link
                href={isTeacherPage ? '/' : '/teacher/courses'}
                className="w-full cursor-pointer flex items-center"
              >
                {isTeacherPage ? (
                  <>
                    <Layout className="w-4 h-4 mr-2" />
                    Student View
                  </>
                ) : (
                  <>
                    <Gauge className="w-4 h-4 mr-2" />
                    Teacher Dashboard
                  </>
                )}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </div>
        )}
        <DropdownMenuItem asChild>
          <div className="w-full">
            <ProfileButton name={user.name} />
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <div className="w-full">
            <LogoutButton />
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserNavMenu;
