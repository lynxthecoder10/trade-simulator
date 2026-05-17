'use client';

import React, { useState } from 'react';
import { useMarketStore } from '@/stores/market-store';
import { useUiStore } from '@/stores/ui-store';
import { TrendingUp, TrendingDown, Plus, X, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Watchlist() {
  const { watchlist, addSymbol, removeSymbol } = useMarketStore();
  const { selectedSymbol, setSelectedSymbol } = useUiStore();
  const [newSymbol, setNewSymbol] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSymbol = newSymbol.trim().toUpperCase();
    if (!cleanSymbol) return;
    addSymbol(cleanSymbol);
    setNewSymbol('');
  };

  return (
    <div className="flex h-full flex-col border border-border bg-card rounded-xl overflow-hidden shadow-md backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4 bg-muted/20">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          Watchlist
        </h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
          {watchlist.length} Assets
        </span>
      </div>

      {/* Add Symbol Input */}
      <form onSubmit={handleAdd} className="p-3 border-b border-border bg-muted/5 flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Add ticker (e.g. AAPL, BTC-USD)..."
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            className="w-full bg-background border border-border focus:border-primary/60 focus:ring-1 focus:ring-primary/60 text-xs rounded-lg pl-3 pr-8 py-2 outline-none transition-all placeholder:text-muted-foreground/60"
          />
        </div>
        <button
          type="submit"
          className="bg-primary hover:bg-primary/95 text-primary-foreground p-2 rounded-lg flex items-center justify-center transition-all shadow-sm active:scale-95"
          title="Add Symbol"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>

      {/* Asset List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {watchlist.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground py-8">
            No assets in watchlist. Add one above!
          </div>
        ) : (
          watchlist.map((item) => {
            const isSelected = selectedSymbol === item.symbol;
            const isPositive = item.change >= 0;
            const hasPrice = item.price > 0;
            const isIndianStock = item.symbol.endsWith('.NS') || ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'].includes(item.symbol);
            const currencySymbol = isIndianStock ? '₹' : '$';

            return (
              <div
                key={item.symbol}
                className={cn(
                  "group relative flex w-full items-center justify-between rounded-lg p-3 text-sm transition-all border border-transparent cursor-pointer",
                  isSelected 
                    ? "bg-accent/80 text-accent-foreground border-border/60 shadow-sm" 
                    : "hover:bg-muted/45"
                )}
                onClick={() => setSelectedSymbol(item.symbol)}
              >
                {/* Symbol Info */}
                <div className="flex flex-col items-start select-none">
                  <span className="font-bold tracking-tight text-foreground">{item.symbol}</span>
                  <span className="text-[10px] text-muted-foreground/80 font-medium">
                    {isIndianStock ? 'NSE' : 'Nasdaq / Crypto'}
                  </span>
                </div>

                {/* Price Info */}
                <div className="flex flex-col items-end select-none pr-6">
                  {hasPrice ? (
                    <>
                      <span className="font-extrabold tabular-nums tracking-tight">
                        {currencySymbol}{item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span className={cn(
                        "text-[11px] font-bold tabular-nums flex items-center gap-0.5 mt-0.5",
                        isPositive ? "text-profit" : "text-loss"
                      )}>
                        {isPositive ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
                        {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground/60 italic animate-pulse">
                      Loading...
                    </span>
                  )}
                </div>

                {/* Hover Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSymbol(item.symbol);
                  }}
                  className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-all"
                  title="Remove Asset"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
