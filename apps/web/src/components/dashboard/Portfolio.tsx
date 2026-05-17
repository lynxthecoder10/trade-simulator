'use client';

import { usePortfolioStore } from '@/stores/portfolio-store';
import { useUiStore } from '@/stores/ui-store';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

export function Portfolio() {
  const { balance, positions } = usePortfolioStore();
  const { selectedSymbol } = useUiStore();

  const getCurrency = (symbol: string) => {
    const isIndianStock = symbol.endsWith('.NS') || ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'].includes(symbol);
    return isIndianStock ? '₹' : '$';
  };

  const isMainIndianStock = selectedSymbol?.endsWith('.NS') || ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'].includes(selectedSymbol || '');
  const mainCurrencySymbol = isMainIndianStock ? '₹' : '$';

  const totalUnrealizedPnl = positions.reduce((acc, p) => acc + p.unrealizedPnl, 0);
  const isPositive = totalUnrealizedPnl >= 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Summary Card */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Available Balance</p>
            <h2 className="text-3xl font-bold tabular-nums tracking-tight">
              {mainCurrencySymbol}{balance.toLocaleString(isMainIndianStock ? 'en-IN' : 'en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>
          <div className="p-3 rounded-xl bg-primary/10">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Total P&L</p>
            <div className={cn("text-lg font-bold tabular-nums flex items-center gap-1.5", isPositive ? "text-profit" : "text-loss")}>
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {mainCurrencySymbol}{totalUnrealizedPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Positions</p>
            <div className="text-lg font-bold text-foreground">
              {positions.length} <span className="text-xs font-medium text-muted-foreground">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Positions Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <h3 className="text-sm font-semibold">Active Positions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr>
                <th className="px-4 py-3 font-semibold">Symbol</th>
                <th className="px-4 py-3 font-semibold text-right">Qty</th>
                <th className="px-4 py-3 font-semibold text-right">Avg Price</th>
                <th className="px-4 py-3 font-semibold text-right">P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {positions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground italic">
                    No active positions
                  </td>
                </tr>
              ) : (
                positions.map((pos) => {
                  const posPositive = pos.unrealizedPnl >= 0;
                  const rowCurrency = getCurrency(pos.symbol);
                  return (
                    <tr key={pos.symbol} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-bold">{pos.symbol}</div>
                        <div className="text-[10px] text-muted-foreground">Equity</div>
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums font-medium">
                        {pos.quantity}
                      </td>
                      <td className="px-4 py-4 text-right tabular-nums">
                        {rowCurrency}{pos.averagePrice.toFixed(2)}
                      </td>
                      <td className={cn("px-4 py-4 text-right tabular-nums font-bold", posPositive ? "text-profit" : "text-loss")}>
                        {rowCurrency}{pos.unrealizedPnl.toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
