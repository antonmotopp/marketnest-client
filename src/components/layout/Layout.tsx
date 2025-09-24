import type { ReactNode } from 'react';
import { Header, Footer } from '@/components/layout';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      <Header />

      <main className="h-full container mx-auto py-20 px-4">{children}</main>

      <Footer />
    </div>
  );
};
