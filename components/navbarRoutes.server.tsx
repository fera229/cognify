import React from 'react';
import { headers } from 'next/headers';
import { NavbarRoutesClient } from './navbarRoutes.client';
import { getUserFromSession } from '@/database/users';

async function NavbarRoutesServer() {
  // Force dynamic rendering by reading headers

  let user = null;
  try {
    user = await getUserFromSession();
  } catch (error) {
    console.error('Error fetching user:', error);
  }

  return (
    <div className="flex justify-between items-center ml-auto">
      <NavbarRoutesClient user={user} />
    </div>
  );
}

export default NavbarRoutesServer;
