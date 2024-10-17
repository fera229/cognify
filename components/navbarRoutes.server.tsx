import React from 'react';
import { NavbarRoutesClient } from './navbarRoutes.client';
import { getUserFromSession } from '@/database/users';
const user = await getUserFromSession();
function NavbarRoutesServer() {
  return (
    <div className="flex justify-between items-center ml-auto">
      <NavbarRoutesClient user={user} />
    </div>
  );
}

export default NavbarRoutesServer;
