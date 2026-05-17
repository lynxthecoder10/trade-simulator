'use client';

import { usePortfolioStore } from '@/stores/portfolio-store';
import { useUiStore } from '@/stores/ui-store';
import { Bell, Search, User } from 'lucide-react';

export function Header() {
  const balance = usePortfolioStore((state) => state.balance);
  const { selectedSymbol } = useUiStore();

  const isIndianStock = selectedSymbol?.endsWith('.NS') || ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'].includes(selectedSymbol || '');
  const currencySymbol = isIndianStock ? '₹' : '$';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      <div className="flex flex-1 items-center gap-4 sm:gap-6">
        <div className="relative w-full max-w-sm hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search symbols..."
            className="w-full rounded-md border border-input bg-background pl-9 pr-4 py-2 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Virtual Balance</span>
          <span className="text-sm font-bold tracking-tight text-profit tabular-nums">
            {currencySymbol}{balance.toLocaleString(isIndianStock ? 'en-IN' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>

        <div className="h-4 w-[1px] bg-border hidden sm:block" />

        <button type="button" className="text-muted-foreground hover:text-foreground relative transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-profit ring-2 ring-background"></span>
        </button>

        <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center cursor-pointer border border-border hover:bg-muted transition-colors">
          <User className="h-4 w-4 text-foreground" />
        </div>
      </div>
    </header>
  );
}
