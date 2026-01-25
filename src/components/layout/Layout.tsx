/**
 * Layout Component
 * Main layout wrapper with Header and Footer
 * Wraps all page content for consistent structure
 */

import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function Layout({
  children,
  showHeader = true,
  showFooter = true
}: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && <Header />}

      <main className="flex-1">
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
}
