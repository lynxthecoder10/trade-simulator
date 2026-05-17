'use client';

import { useState } from 'react';
import { useUiStore } from '@/stores/ui-store';
import { useOrderStore } from '@/stores/order-store';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { useMarketStore } from '@/stores/market-store';
import { cn } from '@/lib/utils';

export function OrderPanel() {
  const { selectedSymbol } = useUiStore();
  const { side, orderType, quantity, setSide, setOrderType, setQuantity } = useOrderStore();
  const sendOrder = usePortfolioStore((state) => state.sendOrder);
  const watchlist = useMarketStore((state) => state.watchlist);

  const currentAsset = watchlist.find(w => w.symbol === selectedSymbol);
  const currentPrice = currentAsset?.price || 0;

  const totalValue = currentPrice * quantity;

  const isIndianStock = selectedSymbol?.endsWith('.NS') || ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'].includes(selectedSymbol || '');
  const currencySymbol = isIndianStock ? '₹' : '$';

  const handleExecute = () => {
    if (!selectedSymbol) return;
    const result = sendOrder(selectedSymbol, quantity, currentPrice, side === 'buy');
    if (!result.success) {
      alert(result.reason); // Simple alert for now, would use toast in production
    }
  };

  return (
    <div className="flex flex-col border border-border bg-card rounded-lg overflow-hidden shadow-sm h-full">
      <div className="border-b border-border p-4 bg-muted/30">
        <h2 className="text-sm font-semibold tracking-tight">Order Entry: {selectedSymbol}</h2>
      </div>
      
      <div className="p-4 space-y-6 flex-1 flex flex-col">
        {/* Side Tabs */}
        <div className="flex rounded-md p-1 bg-muted/50 border border-border/50">
          <button
            onClick={() => setSide('buy')}
            className={cn(
              "flex-1 rounded-sm py-1.5 text-sm font-medium transition-all",
              side === 'buy' ? "bg-profit text-profit-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Buy
          </button>
          <button
            onClick={() => setSide('sell')}
            className={cn(
              "flex-1 rounded-sm py-1.5 text-sm font-medium transition-all",
              side === 'sell' ? "bg-loss text-loss-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sell
          </button>
        </div>

        {/* Order Type Tabs */}
        <div className="flex space-x-4 border-b border-border pb-2">
          <button
            onClick={() => setOrderType('market')}
            className={cn("text-sm font-medium pb-2 border-b-2 transition-colors", orderType === 'market' ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}
          >
            Market
          </button>
          <button
            onClick={() => setOrderType('limit')}
            className={cn("text-sm font-medium pb-2 border-b-2 transition-colors", orderType === 'limit' ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}
          >
            Limit
          </button>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Quantity</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Price ({currencySymbol})</label>
            <input
              type="number"
              value={currentPrice.toFixed(2)}
              disabled
              className="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 tabular-nums font-semibold"
            />
          </div>
        </div>

        <div className="flex-1" /> {/* Spacer */}

        {/* Total & Action */}
        <div className="pt-4 border-t border-border space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="text-sm text-muted-foreground">Est. Value</span>
            <span className="text-sm font-bold tabular-nums tracking-tight">
              {currencySymbol}{totalValue.toLocaleString(isIndianStock ? 'en-IN' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <button
            onClick={handleExecute}
            className={cn(
              "w-full rounded-md px-4 py-3 text-sm font-bold shadow-sm transition-opacity hover:opacity-90",
              side === 'buy' ? "bg-profit text-profit-foreground" : "bg-loss text-loss-foreground"
            )}
          >
            {side === 'buy' ? 'BUY' : 'SELL'} {selectedSymbol}
          </button>
        </div>
      </div>
    </div>
  );
}
