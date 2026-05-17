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
  const { selectedSymbol } = useUiStore();
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
    <div className="flex h-[calc(100vh-2rem-64px)] gap-4 flex-col lg:flex-row">
      {/* Left Sidebar - Watchlist */}
      <div className="w-full lg:w-[280px] xl:w-[320px] shrink-0 h-[300px] lg:h-full">
        <Watchlist />
      </div>

      {/* Main Content - Chart */}
      <div className="flex flex-1 flex-col gap-4 min-h-[400px]">
        <div className="flex items-center justify-between bg-card rounded-lg border border-border p-4 shadow-sm">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{selectedSymbol || 'Select Symbol'}</h1>
              <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Equity</span>
            </div>
            
            {selectedSymbol && (
              <div className="flex flex-col">
                <span className="text-2xl font-bold tabular-nums">
                  {currencySymbol}{currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={cn("text-sm font-medium flex items-center tabular-nums", isPositive ? "text-profit" : "text-loss")}>
                  {isPositive ? '+' : ''}{currentChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{currentChangePercent.toFixed(2)}%)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center">
            <div className="flex items-center px-3 py-1 rounded-full bg-accent/50 border border-border">
               <span className="w-2 h-2 rounded-full bg-profit mr-2 animate-pulse shadow-[0_0_8px_rgba(22,163,74,0.8)]"></span>
               <span className="text-xs font-semibold tracking-wide">MARKET OPEN</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          {selectedSymbol ? (
            <TradingChart data={currentChartData} />
          ) : (
            <div className="w-full h-full min-h-[400px] bg-card rounded-lg border border-border flex items-center justify-center">
              <p className="text-muted-foreground">Select a symbol from the watchlist to view chart</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Order Panel & Analyst */}
      <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 flex flex-col gap-4 overflow-y-auto">
        <OrderPanel />
        {selectedSymbol && <AnalystFeedback symbol={selectedSymbol} />}
      </div>
    </div>
  );
}
