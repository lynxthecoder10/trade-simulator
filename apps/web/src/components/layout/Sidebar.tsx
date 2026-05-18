'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Briefcase, LayoutDashboard, Settings, BookOpen, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Portfolio', href: '/portfolio', icon: Briefcase },
  { name: 'Analytics', href: '/analytics', icon: Activity },
  { name: 'Learn', href: '/learn', icon: BookOpen },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[60px] flex-col items-center border-r border-border bg-[#090d16] py-4 shrink-0 transition-all duration-300">
      {/* Brand Icon */}
      <div className="mb-8 flex items-center justify-center shrink-0">
        <Link 
          href="/" 
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-primary to-indigo-600 font-black text-white shadow-[0_0_12px_rgba(59,130,246,0.5)] transform active:scale-95 transition-transform"
          title="TradeSim Institutional Dashboard"
        >
          T
        </Link>
      </div>

      {/* Vertical Navigation Icons */}
      <nav className="flex flex-1 flex-col items-center space-y-3 w-full px-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'relative group flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 outline-none',
                isActive
                  ? 'bg-primary/20 border border-primary/40 text-primary-foreground shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                  : 'text-muted-foreground hover:bg-muted/30 hover:text-white border border-transparent'
              )}
              title={item.name}
            >
              <item.icon
                className={cn('h-5 w-5 transition-transform group-hover:scale-105', isActive ? 'text-primary-foreground' : 'text-muted-foreground')}
                aria-hidden="true"
              />
              
              {/* Premium Floating tooltip (Inspired by 21st.dev layout rails) */}
              <span className="absolute left-[70px] z-50 scale-0 group-hover:scale-100 transition-all duration-150 origin-left px-2 py-1 rounded bg-[#0b0f19] border border-border text-[11px] font-bold text-white shadow-xl pointer-events-none whitespace-nowrap">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Simple Active Dot indicator at bottom */}
      <div className="mt-auto shrink-0 flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
      </div>
    </div>
  );
}
