import { Button } from '@/components/ui/button';
import { LogOutIcon, User, UserRoundPenIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface ProfileButtonProps {
  name: string;
}
function ProfileButton({ name }: ProfileButtonProps) {
  return (
    <div>
      <Link href={`/profile/${name}`}>
        <Button size={'sm'} variant={'ghost'}>
          <UserRoundPenIcon className="w-4 h-4 mr-2 " />
          Profile
        </Button>
      </Link>
    </div>
  );
}

export default ProfileButton;
