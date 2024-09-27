import React from 'react';
import { Sidebar } from './_components/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      // navbar
      <div></div>
      // sidebar
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-40">
        <Sidebar />
      </div>
      <main className="md:pl-56 h-full">{children}</main>
    </div>
  );
}
