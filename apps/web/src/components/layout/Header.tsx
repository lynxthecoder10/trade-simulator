'use client';

import Link from 'next/link';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { useUiStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { Bell, Search, User, LogOut } from 'lucide-react';

export function Header() {
  const balance = usePortfolioStore((state) => state.balance);
  const { selectedSymbol } = useUiStore();
  const { user, logout } = useAuthStore();

  const isIndianStock = selectedSymbol?.endsWith('.NS') || ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'].includes(selectedSymbol || '');
  
  // Dynamic currency symbol matching display configuration
  let currencySymbol = '₹';
  if (user?.displayCurrency === 'USD') {
    currencySymbol = '$';
  } else if (user?.displayCurrency === 'EUR') {
    currencySymbol = '€';
  } else {
    currencySymbol = isIndianStock ? '₹' : '$';
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-[#090d16] px-4 sm:px-6">
      <div className="flex flex-1 items-center gap-4 sm:gap-6">
        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search symbols (e.g. RELIANCE, TCS)..."
            className="w-full rounded-md border border-border/80 bg-[#020617] pl-9 pr-4 py-2 text-sm text-foreground shadow-inner placeholder:text-muted-foreground focus:border-primary focus-visible:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Dynamic balance display */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Virtual Balance</span>
          <span className="text-sm font-bold tracking-tight text-profit tabular-nums">
            {currencySymbol}{balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-border hidden sm:block" />

        <button type="button" className="text-muted-foreground hover:text-foreground relative transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-profit ring-2 ring-background animate-pulse"></span>
        </button>

        {/* Premium Non-clickable Session Indicator */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-background border border-border/80">
          <img 
            src={user.avatar} 
            alt={user.username} 
            className="h-6 w-6 rounded-full object-cover border border-border" 
          />
          <span className="text-xs font-bold text-slate-300 pr-1">
            {user.username}
          </span>
        </div>
      </div>
    </header>
  );
}
