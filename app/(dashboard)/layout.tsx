import { Suspense } from 'react';
import { Sidebar } from './_components/sidebar';
import { Navbar } from './_components/navbar';
import Footer from '@/components/footer';

function DashboardContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <div className="md:pl-56 fixed z-50 h-[80px] w-full inset-y-0">
        <Suspense fallback={<div>Loading navbar...</div>}>
          <Navbar />
        </Suspense>
      </div>

      {/* Sidebar */}
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-40">
        <Suspense fallback={<div>Loading sidebar...</div>}>
          <Sidebar />
        </Suspense>
      </div>

      {/* Main content and footer wrapper */}
      <div className="flex flex-col min-h-screen">
        {/* Main content with sidebar offset */}
        <main className="flex-1 md:pl-56 pt-[80px]">{children}</main>

        {/* Footer with sidebar offset */}
        <div className="md:pl-56">
          <Footer />
        </div>
      </div>
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
