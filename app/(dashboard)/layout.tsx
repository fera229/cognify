import React from 'react';
import { Sidebar } from './_components/sidebar';
import { Navbar } from './_components/navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      // navbar
      <div className="md:pl-56 fixed z-40 h-[80px] w-full inset-y-0">
        <Navbar />
      </div>
      // sidebar
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-40">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
}
