'use client';

import { TradingChart } from '@/components/charts/TradingChart';
import { Watchlist } from '@/components/dashboard/Watchlist';
import { OrderPanel } from '@/components/dashboard/OrderPanel';
import { AnalystFeedback } from '@/components/dashboard/AnalystFeedback';
import { useUiStore } from '@/stores/ui-store';
import { useEffect, useState } from 'react';
import { CandlestickData, Time } from 'lightweight-charts';
import { useMarketStore } from '@/stores/market-store';
import { globalEventBus, EventType } from '@trade/event-bus';
import { cn } from '@/lib/utils';
import { Maximize2, Minimize2, Grid, Columns, Square } from 'lucide-react';

// Generator to create realistic initial candles
function generateInitialCandles(basePrice: number): CandlestickData[] {
  const candles: CandlestickData[] = [];
  let currentPrice = basePrice;
  const now = Math.floor(Date.now() / 1000);
  
  // Generate 50 historical candles (1 minute each)
  for (let i = 50; i >= 0; i--) {
    const time = (now - i * 60) as Time;
    const volatility = 2.5;
    const open = currentPrice;
    const high = open + Math.random() * volatility;
    const low = open - Math.random() * volatility;
    const close = low + Math.random() * (high - low);
    
    candles.push({ time, open, high, low, close });
    currentPrice = close;
  }
  return candles;
}

const SYMBOLS = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'];
const BASE_PRICES: Record<string, number> = {
  'RELIANCE': 2950.50,
  'TCS': 4120.00,
  'HDFCBANK': 1450.75,
  'INFY': 1680.20,
  'ICICIBANK': 1050.60,
};

export default function DashboardPage() {
  const { 
    selectedSymbol, 
    isTerminalMode, 
    setTerminalMode, 
    chartGrid, 
    setChartGrid 
  } = useUiStore();
  const { watchlist } = useMarketStore();
  
  // Store chart data per symbol
  const [chartDataMap, setChartDataMap] = useState<Record<string, CandlestickData[]>>({});

  useEffect(() => {
    // Initial data generation
    const initialData: Record<string, CandlestickData[]> = {};
    SYMBOLS.forEach(symbol => {
      initialData[symbol] = generateInitialCandles(BASE_PRICES[symbol]);
    });
    setChartDataMap(initialData);

    // Subscribe to Event Bus for real-time chart updates
    const unsubscribe = globalEventBus.subscribe(EventType.MARKET_TICK, (tick: any) => {
      setChartDataMap(prev => {
        const symbolData = [...(prev[tick.symbol] || [])];
        if (symbolData.length === 0) return prev;
        
        const lastCandle = { ...symbolData[symbolData.length - 1] };
        
        lastCandle.close = tick.price;
        if (tick.price > lastCandle.high) lastCandle.high = tick.price;
        if (tick.price < lastCandle.low) lastCandle.low = tick.price;
        
        symbolData[symbolData.length - 1] = lastCandle;
        
        return {
          ...prev,
          [tick.symbol]: symbolData
        };
      });
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const currentChartData = selectedSymbol && chartDataMap[selectedSymbol] 
    ? chartDataMap[selectedSymbol] 
    : [];

  const currentAsset = watchlist.find(w => w.symbol === selectedSymbol);
  const currentPrice = currentAsset?.price || 0;
  const currentChange = currentAsset?.change || 0;
  const currentChangePercent = currentAsset?.changePercent || 0;
  const isPositive = currentChange >= 0;
  const isIndianStock = selectedSymbol?.endsWith('.NS') || ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'].includes(selectedSymbol || '');
  const currencySymbol = isIndianStock ? '₹' : '$';

  return (
    <div className="flex h-[calc(100vh-2rem-64px)] gap-4 flex-col lg:flex-row relative">
      {/* Left Sidebar - Watchlist (Hidden in Terminal Mode) */}
      {!isTerminalMode && (
        <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0 h-[300px] lg:h-full transition-all duration-300">
          <Watchlist />
        </div>
      )}

      {/* Main Content - Chart */}
      <div className="flex flex-1 flex-col gap-4 min-h-[400px]">
        {/* Glassmorphic Live Header */}
        <div className="flex items-center justify-between bg-card/65 backdrop-blur-md rounded-lg border border-border/80 p-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">{selectedSymbol || 'Select Symbol'}</h1>
              <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Equity</span>
            </div>
            
            {selectedSymbol && (
              <div className="flex flex-col">
                <span className="text-2xl font-bold tabular-nums text-white">
                  {currencySymbol}{currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={cn("text-sm font-medium flex items-center tabular-nums", isPositive ? "text-emerald-500" : "text-rose-500")}>
                  {isPositive ? '+' : ''}{currentChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{currentChangePercent.toFixed(2)}%)
                </span>
              </div>
            )}
          </div>

          {/* Interactive Layout Controls (Inspired by 21st.dev Premium Terminals) */}
          <div className="flex items-center gap-3">
            {/* Grid Switchers (Only show when selectedSymbol is active) */}
            {selectedSymbol && (
              <div className="flex items-center bg-background/80 border border-border/60 rounded-lg p-0.5 shadow-inner">
                <button
                  onClick={() => setChartGrid(1)}
                  className={cn(
                    "p-1.5 rounded transition-all",
                    chartGrid === 1 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-white"
                  )}
                  title="Single Chart"
                >
                  <Square className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setChartGrid(2)}
                  className={cn(
                    "p-1.5 rounded transition-all",
                    chartGrid === 2 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-white"
                  )}
                  title="Split Charts (2)"
                >
                  <Columns className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setChartGrid(4)}
                  className={cn(
                    "p-1.5 rounded transition-all",
                    chartGrid === 4 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-white"
                  )}
                  title="Quad Charts (4)"
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Terminal / Full Screen Toggle */}
            <button
              onClick={() => setTerminalMode(!isTerminalMode)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95",
                isTerminalMode 
                  ? "bg-rose-500/10 border-rose-500/40 text-rose-400 hover:bg-rose-500/20" 
                  : "bg-primary/10 border-primary/30 text-primary-foreground hover:bg-primary/20"
              )}
            >
              {isTerminalMode ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>EXIT FULLSCREEN</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>PRO TERMINAL</span>
                </>
              )}
            </button>

            {/* Live Indicator */}
            <div className="hidden sm:flex items-center px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
               <span className="text-xs font-semibold tracking-wide text-emerald-400">LIVE FEED</span>
            </div>
          </div>
        </div>
        
        {/* Expanded Chart Grid Container */}
        <div className="flex-1 min-h-[450px]">
          {selectedSymbol ? (
            <TradingChart 
              symbol={selectedSymbol} 
              heightClass="h-full" 
              grid={chartGrid} 
            />
          ) : (
            <div className="w-full h-full min-h-[400px] bg-card rounded-lg border border-border flex items-center justify-center">
              <p className="text-muted-foreground">Select a symbol from the watchlist to view chart</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Order Panel & Analyst (Hidden in Terminal Mode) */}
      {!isTerminalMode && (
        <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 flex flex-col gap-4 overflow-y-auto transition-all duration-300">
          <OrderPanel />
          {selectedSymbol && <AnalystFeedback symbol={selectedSymbol} />}
        </div>
      )}
    </div>
  );
}
