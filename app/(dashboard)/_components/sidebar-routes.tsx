'use client';

import { Compass, Layout } from 'lucide-react';
import { SidebarItem } from './sidebar-item';

const userRoutes = [
  {
    icon: Layout,
    label: 'Dashboard',
    href: '/',
  },
  {
    icon: Compass,
    label: 'Browse',
    href: '/search',
  },
];

export const SidebarRoutes = () => {
  const routes = userRoutes;
  return (
    <div>
      {routes.map((route) => (
        <SidebarItem
          key={route.label}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
