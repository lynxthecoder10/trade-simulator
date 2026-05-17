'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Briefcase, LayoutDashboard, Settings, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Portfolio', href: '/portfolio', icon: Briefcase },
  { name: 'Analytics', href: '/analytics', icon: Activity },
  { name: 'Learn', href: '/learn', icon: BookOpen },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-[64px] flex-col border-r border-border bg-card py-4 sm:w-[220px]">
      <div className="mb-8 flex items-center justify-center px-4 sm:justify-start">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground shrink-0">
          T
        </div>
        <span className="ml-3 hidden text-lg font-semibold tracking-tight sm:block">TradeSim</span>
      </div>

      <nav className="flex flex-1 flex-col space-y-1 px-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent/50 text-accent-foreground'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              <item.icon
                className={cn('h-5 w-5 shrink-0', isActive ? 'text-accent-foreground' : 'text-muted-foreground group-hover:text-foreground')}
                aria-hidden="true"
              />
              <span className="ml-3 hidden sm:block">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
