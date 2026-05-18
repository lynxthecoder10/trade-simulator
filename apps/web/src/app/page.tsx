'use client';

import { TradingChart } from '@/components/charts/TradingChart';
import { Watchlist } from '@/components/dashboard/Watchlist';
import { OrderPanel } from '@/components/dashboard/OrderPanel';
import { AnalystFeedback } from '@/components/dashboard/AnalystFeedback';
import { Footer } from '@/components/layout/Footer';
import { useUiStore } from '@/stores/ui-store';
import { useEffect, useState } from 'react';
import { CandlestickData, Time } from 'lightweight-charts';
import { useMarketStore } from '@/stores/market-store';
import { globalEventBus, EventType } from '@trade/event-bus';
import { cn } from '@/lib/utils';
import { Maximize2, Minimize2, Grid, Columns, Square, Eye, FileText, Move, X } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

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
    setChartGrid,
    isWatchlistOpen,
    setWatchlistOpen,
    isOrderPanelOpen,
    setOrderPanelOpen
  } = useUiStore();
  const { watchlist } = useMarketStore();
  const watchlistDragControls = useDragControls();
  const orderDragControls = useDragControls();
  
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
    <div className="flex flex-col h-[calc(100vh-64px)] w-full overflow-hidden bg-[#020617]">
      {/* Central Area: Chart Background + Draggable Widgets Overlay */}
      <div className="flex-1 relative w-full overflow-hidden flex flex-col">
        
        {/* Fullscreen Chart Background */}
        <div className="absolute inset-0 w-full h-full z-10">
          {selectedSymbol ? (
            <TradingChart 
              symbol={selectedSymbol} 
              heightClass="h-full" 
              grid={chartGrid} 
            />
          ) : (
            <div className="w-full h-full bg-[#090d16] flex items-center justify-center">
              <p className="text-muted-foreground text-sm font-semibold">Select a symbol from the watchlist to view chart</p>
            </div>
          )}
        </div>

        {/* Floating Top Navigation Header */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between border backdrop-blur-md transition-all shadow-[0_4px_20px_rgba(0,0,0,0.55)] bg-[#090d16]/85 border-border/70 rounded-xl p-3">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-lg lg:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                {selectedSymbol || 'Select Symbol'}
              </h1>
              <span className="text-muted-foreground text-[9px] font-bold uppercase tracking-wider block mt-0.5">Equity</span>
            </div>
            
            {selectedSymbol && (
              <div className="flex flex-col">
                <span className="text-lg lg:text-xl font-black tabular-nums text-white">
                  {currencySymbol}{currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={cn("text-[10px] font-bold flex items-center tabular-nums mt-0.5", isPositive ? "text-emerald-500" : "text-rose-500")}>
                  {isPositive ? '+' : ''}{currentChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{currentChangePercent.toFixed(2)}%)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Panel Overlay Switches */}
            <div className="flex items-center bg-background/80 border border-border/60 rounded-lg p-0.5 shadow-inner mr-2">
              <button
                onClick={() => setWatchlistOpen(!isWatchlistOpen)}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold transition-all",
                  isWatchlistOpen 
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" 
                    : "text-muted-foreground hover:text-white"
                )}
                title="Watchlist Panel"
              >
                <Eye className="w-3 h-3" />
                <span>WATCHLIST</span>
              </button>
              <button
                onClick={() => setOrderPanelOpen(!isOrderPanelOpen)}
                className={cn(
                  "flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold transition-all",
                  isOrderPanelOpen 
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" 
                    : "text-muted-foreground hover:text-white"
                )}
                title="Order Panel"
              >
                <FileText className="w-3 h-3" />
                <span>ORDER</span>
              </button>
            </div>

            {/* Grid Switchers (Only show when selectedSymbol is active) */}
            {selectedSymbol && (
              <div className="flex items-center bg-background/80 border border-border/60 rounded-lg p-0.5 shadow-inner">
                <button
                  onClick={() => setChartGrid(1)}
                  className={cn(
                    "p-1 rounded transition-all",
                    chartGrid === 1 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-white"
                  )}
                  title="Single Chart"
                >
                  <Square className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setChartGrid(2)}
                  className={cn(
                    "p-1 rounded transition-all",
                    chartGrid === 2 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-white"
                  )}
                  title="Split Charts (2)"
                >
                  <Columns className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setChartGrid(4)}
                  className={cn(
                    "p-1 rounded transition-all",
                    chartGrid === 4 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-white"
                  )}
                  title="Quad Charts (4)"
                >
                  <Grid className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Live Indicator */}
            <div className="hidden sm:flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
               <span className="text-[9px] font-bold tracking-wide text-emerald-400">LIVE FEED</span>
            </div>
          </div>
        </div>

        {/* Overlay Floating Draggable Widgets */}
        <AnimatePresence>
          {/* Draggable Watchlist Popup (Default Left-Side Position) */}
          {isWatchlistOpen && (
            <motion.div
              drag
              dragControls={watchlistDragControls}
              dragListener={false}
              dragMomentum={false}
              dragElastic={0}
              initial={{ x: 20, y: 80 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-30 w-[300px] h-[480px] bg-[#090d16]/95 backdrop-blur-md border border-border/80 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.65)] flex flex-col overflow-hidden"
            >
              {/* Header Drag Handle */}
              <div 
                onPointerDown={(e) => watchlistDragControls.start(e)}
                className="px-3 py-2 bg-slate-900/80 border-b border-border/40 flex items-center justify-between cursor-move select-none shrink-0"
              >
                <div className="flex items-center gap-1.5 pointer-events-none">
                  <Move className="w-3 h-3 text-indigo-400" />
                  <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">Watchlist Widget</span>
                </div>
                <button 
                  onClick={() => setWatchlistOpen(false)} 
                  className="text-muted-foreground hover:text-white transition-colors duration-150 relative z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Panel Content */}
              <div className="flex-1 overflow-hidden">
                <Watchlist />
              </div>
            </motion.div>
          )}

          {/* Draggable Order Entry Popup (Default Right-Side Position) */}
          {isOrderPanelOpen && (
            <motion.div
              drag
              dragControls={orderDragControls}
              dragListener={false}
              dragMomentum={false}
              dragElastic={0}
              // Placed top-right safely across screens
              initial={{ x: typeof window !== 'undefined' ? window.innerWidth - 360 : 800, y: 80 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-30 w-[330px] h-[520px] bg-[#090d16]/95 backdrop-blur-md border border-border/80 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.65)] flex flex-col overflow-hidden"
            >
              {/* Header Drag Handle */}
              <div 
                onPointerDown={(e) => orderDragControls.start(e)}
                className="px-3 py-2 bg-slate-900/80 border-b border-border/40 flex items-center justify-between cursor-move select-none shrink-0"
              >
                <div className="flex items-center gap-1.5 pointer-events-none">
                  <Move className="w-3 h-3 text-rose-400" />
                  <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider">Order & Execution</span>
                </div>
                <button 
                  onClick={() => setOrderPanelOpen(false)} 
                  className="text-muted-foreground hover:text-white transition-colors duration-150 relative z-10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 custom-scrollbar">
                <OrderPanel />
                {selectedSymbol && (
                  <div className="border-t border-border/40 pt-3">
                    <AnalystFeedback symbol={selectedSymbol} />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Dynamic Premium Glassmorphic Footer */}
      <Footer />
    </div>
  );
}

