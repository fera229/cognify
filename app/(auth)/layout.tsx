import { Suspense } from 'react';
import Footer from '@/components/footer';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div>Loading...</div>}>
        <main className="flex-grow">{children}</main>
      </Suspense>
      <div className="flex-none">
        <Footer />
      </div>
    </div>
  );
}
