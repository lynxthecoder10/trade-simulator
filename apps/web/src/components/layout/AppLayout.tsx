'use client';

import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuthStore } from '@/stores/auth-store';
import AuthPage from '@/app/auth/page';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Sync mounting state to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#020617]">
        <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
      </div>
    );
  }

  // If unauthenticated and not already on the auth page, render the auth shield!
  if (!isAuthenticated && pathname !== '/auth') {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30 selection:text-white">
      {pathname !== '/auth' && <Sidebar />}
      <div className="flex flex-1 flex-col overflow-hidden">
        {pathname !== '/auth' && <Header />}
        <main className="flex-1 overflow-hidden bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
