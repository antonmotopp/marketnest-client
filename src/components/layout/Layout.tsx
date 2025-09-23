import type { ReactNode } from 'react';
import { Header, Footer } from '@/components/layout';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <Header />

      <main className="container justify-center items-center mx-auto flex mt-12 px-4">
        {children}
      </main>

      <Footer />
    </div>
  );
};
