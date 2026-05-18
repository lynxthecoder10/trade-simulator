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
  
  const [chartDataMap, setChartDataMap] = useState<Record<string, CandlestickData[]>>({});

  useEffect(() => {
    const initialData: Record<string, CandlestickData[]> = {};
    SYMBOLS.forEach(symbol => {
      initialData[symbol] = generateInitialCandles(BASE_PRICES[symbol]);
    });
    setChartDataMap(initialData);

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
    <div 
      className={cn(
        "flex h-[calc(100vh-64px)] w-full overflow-hidden bg-[#020617] transition-all duration-300",
        isTerminalMode ? "p-0 gap-0" : "p-3 gap-3 flex-col lg:flex-row"
      )}
    >
      {/* Left Sidebar - Watchlist (Hidden in Terminal Mode) */}
      {!isTerminalMode && (
        <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0 h-[300px] lg:h-full flex flex-col overflow-hidden transition-all duration-300">
          <Watchlist />
        </div>
      )}

      {/* Main Content - Chart */}
      <div className="flex flex-1 flex-col gap-3 min-w-0 h-full overflow-hidden">
        {/* Glassmorphic Live Header */}
        <div 
          className={cn(
            "flex items-center justify-between border backdrop-blur-md transition-all shadow-[0_4px_20px_rgba(0,0,0,0.4)]",
            isTerminalMode 
              ? "bg-[#090d16]/90 border-b border-border/80 border-t-0 border-l-0 border-r-0 rounded-none p-4" 
              : "bg-card/65 border-border/80 rounded-lg p-4"
          )}
        >
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-xl lg:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                {selectedSymbol || 'Select Symbol'}
              </h1>
              <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider block mt-0.5">Equity</span>
            </div>
            
            {selectedSymbol && (
              <div className="flex flex-col">
                <span className="text-xl lg:text-2xl font-black tabular-nums text-white">
                  {currencySymbol}{currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={cn("text-xs font-semibold flex items-center tabular-nums mt-0.5", isPositive ? "text-emerald-500" : "text-rose-500")}>
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
                  <Square className="w-3.5 h-3.5" />
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
                  <Columns className="w-3.5 h-3.5" />
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
                  <Grid className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Terminal / Full Screen Toggle */}
            <button
              onClick={() => setTerminalMode(!isTerminalMode)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] lg:text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95",
                isTerminalMode 
                  ? "bg-rose-500/10 border-rose-500/40 text-rose-400 hover:bg-rose-500/20" 
                  : "bg-primary/10 border-primary/30 text-primary-foreground hover:bg-primary/20"
              )}
            >
              {isTerminalMode ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">EXIT FULLSCREEN</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PRO TERMINAL</span>
                </>
              )}
            </button>

            {/* Live Indicator */}
            <div className="hidden sm:flex items-center px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
               <span className="text-[10px] font-bold tracking-wide text-emerald-400">LIVE FEED</span>
            </div>
          </div>
        </div>
        
        {/* Expanded Chart Grid Container */}
        <div className="flex-1 min-h-0 overflow-hidden">
          {selectedSymbol ? (
            <TradingChart 
              symbol={selectedSymbol} 
              heightClass="h-full" 
              grid={chartGrid} 
            />
          ) : (
            <div className="w-full h-full bg-[#090d16] rounded-lg border border-border/80 flex items-center justify-center">
              <p className="text-muted-foreground text-sm font-semibold">Select a symbol from the watchlist to view chart</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Order Panel & Analyst (Hidden in Terminal Mode) */}
      {!isTerminalMode && (
        <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 h-full flex flex-col gap-3 overflow-y-auto transition-all duration-300">
          <div className="flex-1 min-h-[300px]">
            <OrderPanel />
          </div>
          {selectedSymbol && (
            <div className="shrink-0">
              <AnalystFeedback symbol={selectedSymbol} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
