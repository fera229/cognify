import Link from 'next/link';
import { Logo } from './logo';
import { SidebarRoutes } from './sidebar-routes';
import { Button } from '@/components/ui/button';

export const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white shadow-sm">
      <div className="p-6">
        <Link href="/">
          <Logo />
        </Link>
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};
