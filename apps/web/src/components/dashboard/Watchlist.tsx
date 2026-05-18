'use client';

import React, { useState } from 'react';
import { useMarketStore } from '@/stores/market-store';
import { useUiStore } from '@/stores/ui-store';
import { Tooltip } from '@/components/ui/Tooltip';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  X, 
  Search, 
  ListPlus, 
  BellRing, 
  Newspaper, 
  CalendarRange, 
  Flame, 
  Activity, 
  Info,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Simulated stock news dictionary to display real-time financial sentiment
const STOCK_NEWS: Record<string, string> = {
  'RELIANCE': 'Reliance Industries spikes +1.8% on global oil refinery margins expansion and retail business growth.',
  'TCS': 'Tata Consultancy Services bags ₹4,500 Cr digital modernization contract with European financial hubs.',
  'HDFCBANK': 'HDFC Bank credit book surges 16.5% YoY; retail deposits cross record benchmark valuations.',
  'INFY': 'Infosys accelerates enterprise AI cloud deployments; operating margins stabilize at 21.2%.',
  'ICICIBANK': 'ICICI Bank NPA ratios contract to record lows; analysts upgrade target with high buy conviction.',
  'AAPL': 'Apple Inc. launches AI Siri updates; supply chain indicates heavy global retail orders pipeline.',
  'TSLA': 'Tesla autonomous driving beta expands across major metro hubs; factory output targets raised.',
  'DEFAULT': 'Indian shares join Asian consolidation as investors assess interest rate benchmarks and margin reserves.'
};

export function Watchlist() {
  const { watchlist, addSymbol, removeSymbol } = useMarketStore();
  const { selectedSymbol, setSelectedSymbol } = useUiStore();
  const [newSymbol, setNewSymbol] = useState('');
  const [activeRightTab, setActiveRightTab] = useState<string>('watchlist');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSymbol = newSymbol.trim().toUpperCase();
    if (!cleanSymbol) return;
    addSymbol(cleanSymbol);
    setNewSymbol('');
  };

  const rightTabs = [
    { id: 'watchlist', title: 'Watchlist & Details', icon: ListPlus },
    { id: 'alerts', title: 'Price Alerts Tracker', icon: BellRing },
    { id: 'news', title: 'Financial News Feed', icon: Newspaper },
    { id: 'calendar', title: 'Economic Calendar', icon: CalendarRange },
    { id: 'hotlists', title: 'Market Hotlists Tracker', icon: Flame }
  ];

  // Selected asset attributes
  const currentAsset = watchlist.find(w => w.symbol === selectedSymbol);
  const currentPrice = currentAsset?.price || 0;
  const currentChange = currentAsset?.change || 0;
  const currentChangePercent = currentAsset?.changePercent || 0;
  const isPositive = currentChange >= 0;
  
  const isIndianStock = selectedSymbol?.endsWith('.NS') || ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'].includes(selectedSymbol || '');
  const currencySymbol = isIndianStock ? '₹' : '$';
  
  const assetNews = selectedSymbol && STOCK_NEWS[selectedSymbol] 
    ? STOCK_NEWS[selectedSymbol] 
    : STOCK_NEWS['DEFAULT'];

  return (
    <div className="flex h-full flex-row border border-border bg-card rounded-xl overflow-hidden shadow-md backdrop-blur-md">
      
      {/* Left Content Area: Watchlist + Symbol Details */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-3.5 bg-muted/20">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-primary" />
            Watchlist
            <Tooltip 
              title="Real-Time Watchlist" 
              content="Lists your monitored assets. Click on any asset to synchronize charts and place virtual trades instantly." 
              className="ml-1"
            />
          </h2>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase">
            {watchlist.length} Assets
          </span>
        </div>

        {/* Add Symbol Input */}
        <form onSubmit={handleAdd} className="p-2.5 border-b border-border bg-muted/5 flex gap-2 shrink-0">
          <input
            type="text"
            placeholder="Add ticker (e.g. AAPL, BTC-USD)..."
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            className="flex-1 bg-background border border-border focus:border-primary/60 focus:ring-1 focus:ring-primary/60 text-xs rounded-lg pl-3 pr-2 py-2 outline-none text-white transition-all placeholder:text-muted-foreground/60"
          />
          <button
            type="submit"
            className="bg-primary hover:bg-primary/95 text-primary-foreground p-2 rounded-lg flex items-center justify-center transition-all shadow-sm active:scale-95 shrink-0"
            title="Add Symbol"
          >
            <Plus className="h-4 w-4" />
          </button>
        </form>

        {/* Asset List Container (Top Half) */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5 min-h-[150px]">
          {watchlist.length === 0 ? (
            <div className="text-center text-xs text-muted-foreground py-8">
              No assets in watchlist. Add one above!
            </div>
          ) : (
            watchlist.map((item) => {
              const isSelected = selectedSymbol === item.symbol;
              const isItemPositive = item.change >= 0;
              const hasPrice = item.price > 0;
              const itemIsIndian = item.symbol.endsWith('.NS') || ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'].includes(item.symbol);
              const itemCurrency = itemIsIndian ? '₹' : '$';

              return (
                <div
                  key={item.symbol}
                  className={cn(
                    "group relative flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-all border border-transparent cursor-pointer",
                    isSelected 
                      ? "bg-accent/80 text-accent-foreground border-border/60 shadow-sm" 
                      : "hover:bg-muted/45"
                  )}
                  onClick={() => setSelectedSymbol(item.symbol)}
                >
                  <div className="flex flex-col items-start select-none">
                    <span className="font-bold tracking-tight text-white">{item.symbol}</span>
                    <span className="text-[9px] text-muted-foreground/80 font-medium">
                      {itemIsIndian ? 'NSE' : 'Nasdaq / Crypto'}
                    </span>
                  </div>

                  <div className="flex flex-col items-end select-none pr-6">
                    {hasPrice ? (
                      <>
                        <span className="font-bold tabular-nums tracking-tight text-slate-100">
                          {itemCurrency}{item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className={cn(
                          "text-[9px] font-extrabold tabular-nums flex items-center gap-0.5 mt-0.5",
                          isItemPositive ? "text-profit" : "text-loss"
                        )}>
                          {isItemPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] text-muted-foreground/60 italic animate-pulse">
                        Loading...
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSymbol(item.symbol);
                    }}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-all"
                    title="Remove Asset"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* TradingView-Style Symbol Details Card (Bottom Half) */}
        {selectedSymbol && currentAsset && (
          <div className="border-t border-border bg-[#090d16]/90 p-3.5 space-y-3.5 shrink-0 select-none">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
                  {selectedSymbol}
                  <Tooltip 
                    title="Index Listing" 
                    content="The security's full tick descriptor and exchange routing parameters." 
                  />
                </h3>
                <span className="text-[10px] text-muted-foreground block mt-0.5 font-medium">
                  {isIndianStock ? 'Nifty 50 Index · NSE' : 'Global Crypto/Nasdaq Asset'}
                </span>
              </div>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-extrabold text-emerald-400">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                MARKET OPEN
              </div>
            </div>

            {/* Huge Price Ticket */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white tracking-tight tabular-nums">
                {currencySymbol}{currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={cn(
                "text-xs font-bold tabular-nums",
                isPositive ? "text-emerald-500" : "text-rose-500"
              )}>
                {isPositive ? '+' : ''}{currentChangePercent.toFixed(2)}%
              </span>
            </div>

            {/* Simulated News Feed Item */}
            <div className="bg-background/40 border border-border/80 rounded-lg p-2.5">
              <span className="text-[9px] font-extrabold text-primary uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Activity className="w-3 h-3 text-primary shrink-0" />
                Latest Asset Sentiment
              </span>
              <p className="text-[10px] text-slate-300 leading-relaxed font-semibold">
                {assetNews}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2 text-[10px] border-t border-border/60 pt-3">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Day Range</span>
                <span className="text-white font-bold tabular-nums">
                  {currencySymbol}{(currentPrice * 0.985).toFixed(1)} - {currencySymbol}{(currentPrice * 1.015).toFixed(1)}
                </span>
              </div>
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Volume</span>
                <span className="text-white font-bold tabular-nums">
                  {(currentPrice > 1000 ? '4.8M' : '12.4M')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: TradingView Sleek Option Toolbar Strip */}
      <div className="w-[38px] h-full bg-[#090d16] border-l border-border/80 flex flex-col items-center py-2 shrink-0 gap-2 select-none z-10">
        {rightTabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeRightTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveRightTab(tab.id)}
              className={cn(
                "w-7.5 h-7.5 rounded flex items-center justify-center transition-all duration-150 transform active:scale-95 group relative border border-transparent",
                isActive 
                  ? "bg-primary/20 text-primary border-primary/30 shadow-inner" 
                  : "text-muted-foreground hover:bg-muted/30 hover:text-white"
              )}
              title={tab.title}
            >
              <TabIcon className="w-4 h-4" />
              
              {/* Float Tooltip */}
              <span className="absolute right-[45px] z-50 scale-0 group-hover:scale-100 transition-all duration-150 origin-right px-2 py-1 rounded bg-[#0b0f19] border border-border text-[9px] font-bold text-white shadow-xl pointer-events-none whitespace-nowrap">
                {tab.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
