import { Button } from '@/components/ui/button';
import { LogOutIcon } from 'lucide-react';
import React from 'react';
import { logout } from './actions';

function LogoutButton() {
  return (
    <form>
      <Button size={'sm'} variant={'ghost'} formAction={logout}>
        <LogOutIcon className="w-4 h-4 mr-2 " />
        Logout
      </Button>
    </form>
  );
}

export default LogoutButton;
