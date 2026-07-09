'use client';

import { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { theme, _hasHydrated } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Apply theme class to <html>
  useEffect(() => {
    if (_hasHydrated) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, _hasHydrated]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleCloseSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <>
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 h-14 z-40 md:hidden flex items-center px-4 mobile-header">
        <button
          onClick={() => setSidebarOpen(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
        >
          <Menu size={20} />
        </button>
        <span className="ml-3 font-display font-semibold text-lg">
          <span className="gradient-text">Lingua</span>
          <span className="text-text-primary">Loop</span>
        </span>
      </div>

      <main className="flex-1 md:ml-[260px] pt-14 md:pt-0 min-h-screen">
        {children}
      </main>
    </>
  );
}
