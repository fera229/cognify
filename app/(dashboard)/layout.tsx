// app/(dashboard)/layout.tsx
import { Suspense } from 'react';
import { Sidebar } from './_components/sidebar';
import { Navbar } from './_components/navbar';

function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <div className="md:pl-56 fixed z-40 h-[80px] w-full inset-y-0">
        <Suspense fallback={<div>Loading navbar...</div>}>
          <Navbar />
        </Suspense>
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-40">
        <Suspense fallback={<div>Loading sidebar...</div>}>
          <Sidebar />
        </Suspense>
      </div>
      <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}
