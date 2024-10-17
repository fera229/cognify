import { MobileSidebar } from './mobile-sidebar';
import NavbarRoutesServer from '@/components/navbarRoutes.server';

export const Navbar = () => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />

      <NavbarRoutesServer />
    </div>
  );
};
