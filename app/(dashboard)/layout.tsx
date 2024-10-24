import React, { Suspense } from 'react';
import { Sidebar } from './_components/sidebar';
import { Navbar } from './_components/navbar';
import Footer from '@/components/footer';
import DashboardLoading from './_components/loading';

// Separate async component for data fetching
async function DashboardContainer({ children }: { children: React.ReactNode }) {
  // Fetch data here so that frequently fetched data can be centralized here(useContext?)
  return (
    <>
      <div className="flex-none">
        <div className="md:pl-56 fixed z-40 h-[80px] w-full top-0">
          <Navbar />
        </div>
        <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-40">
          <Sidebar />
        </div>
      </div>

      <main className="flex-grow md:pl-56 pt-[80px]">{children}</main>

      <div className="flex-none md:pl-56">
        <Footer />
      </div>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative flex flex-col">
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContainer>{children}</DashboardContainer>
      </Suspense>
    </div>
  );
}
