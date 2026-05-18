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
import { Maximize2, Minimize2, Grid, Columns, Square, Eye, FileText, Move, X, List, TrendingUp, ArrowUpDown } from 'lucide-react';
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

const SYMBOLS = [
  'RELIANCE.NS',
  'TCS.NS',
  'HDFCBANK.NS',
  'INFY.NS',
  'ICICIBANK.NS',
  'AAPL',
  'TSLA',
  'BTC-USD'
];
const BASE_PRICES: Record<string, number> = {
  'RELIANCE.NS': 2444.70,
  'TCS.NS': 3854.62,
  'HDFCBANK.NS': 1426.55,
  'INFY.NS': 150.61,
  'ICICIBANK.NS': 149.52,
  'AAPL': 149.45,
  'TSLA': 174.78,
  'BTC-USD': 65000.00,
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
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState<'watchlist' | 'chart' | 'trade'>('watchlist');

  // Responsiveness Hook
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Helpful Shortcut: When a child selects a stock in the Watchlist tab on mobile,
  // automatically jump to the "Chart" tab so they can instantly see the gorgeous graph!
  useEffect(() => {
    if (isMobile && selectedSymbol) {
      setActiveTab('chart');
    }
  }, [selectedSymbol, isMobile]);

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
      {/* Central Area: Chart Background + Tab Routing / Draggable Widgets */}
      <div className="flex-1 relative w-full overflow-hidden flex flex-col">
        
        {isMobile ? (
          /* Mobile Kid-Friendly Navigation View */
          <div className="flex-1 w-full h-full overflow-hidden flex flex-col p-3 pt-18">
            {activeTab === 'watchlist' && (
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="mb-2 text-center select-none">
                  <span className="text-[10px] font-black text-primary tracking-widest uppercase">Monitored Assets</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Tap on any stock to view its real-time chart and trade!</p>
                </div>
                <div className="flex-1 overflow-hidden">
                  <Watchlist />
                </div>
              </div>
            )}
            
            {activeTab === 'chart' && (
              <div className="flex-1 relative overflow-hidden rounded-xl border border-slate-800/80 bg-[#090d16]/40 flex flex-col">
                <div className="flex-1 relative">
                  {selectedSymbol ? (
                    <TradingChart 
                      symbol={selectedSymbol} 
                      heightClass="h-full" 
                      grid={1} 
                    />
                  ) : (
                    <div className="w-full h-full bg-[#090d16] flex flex-col items-center justify-center p-6 text-center select-none">
                      <TrendingUp className="h-10 w-10 text-indigo-500 animate-pulse mb-3" />
                      <p className="text-slate-300 text-sm font-bold">No Stock Chosen Yet</p>
                      <p className="text-xs text-slate-500 max-w-xs mt-1 mb-4">Select a company from your Watchlist tab below to start watching live graphs!</p>
                      <button 
                        onClick={() => setActiveTab('watchlist')}
                        className="bg-primary text-white text-xs font-extrabold px-5 py-2.5 rounded-xl uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        Choose Stock
                      </button>
                    </div>
                  )}
                </div>
                
                {selectedSymbol && (
                  <div className="p-2 border-t border-slate-900 bg-[#090d16]/90 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-white">{selectedSymbol}</span>
                      <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                        {currencySymbol}{currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab('trade')}
                      className="bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg uppercase tracking-wider transition-all"
                    >
                      Instant Trade
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'trade' && (
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                {selectedSymbol ? (
                  <>
                    <div className="mb-1 text-center select-none">
                      <span className="text-[10px] font-black text-rose-400 tracking-widest uppercase">Trading Deck</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">Simply enter your quantity and tap BUY or SELL below!</p>
                    </div>
                    <OrderPanel />
                    <div className="border border-border/80 bg-card rounded-lg p-3">
                      <AnalystFeedback symbol={selectedSymbol} />
                    </div>
                  </>
                ) : (
                  <div className="h-full w-full bg-[#090d16] flex flex-col items-center justify-center p-6 text-center select-none py-16">
                    <ArrowUpDown className="h-10 w-10 text-rose-400 animate-pulse mb-3" />
                    <p className="text-slate-300 text-sm font-bold">Trading Deck Locked</p>
                    <p className="text-xs text-slate-500 max-w-xs mt-1 mb-4">Please choose a stock from the Watchlist tab first so we know what to buy or sell!</p>
                    <button 
                      onClick={() => setActiveTab('watchlist')}
                      className="bg-primary text-white text-xs font-extrabold px-5 py-2.5 rounded-xl uppercase tracking-wider shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      Open Watchlist
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Desktop & Tablet Draggable Workspaces */
          <>
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
          </>
        )}

        {/* Top Header Card (Responsive: Highly simplified on Mobile devices) */}
        <div className={cn(
          "absolute top-3 left-3 right-3 z-20 flex items-center justify-between border backdrop-blur-md transition-all shadow-[0_4px_20px_rgba(0,0,0,0.55)] bg-[#090d16]/85 border-border/70 rounded-xl",
          isMobile ? "py-2 px-3.5" : "p-3"
        )}>
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <h1 className="text-sm sm:text-lg lg:text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                {selectedSymbol || 'Select Stock'}
              </h1>
              <span className="text-muted-foreground text-[8px] sm:text-[9px] font-bold uppercase tracking-wider block mt-0.5">Asset Status</span>
            </div>
            
            {selectedSymbol && (
              <div className="flex flex-col">
                <span className="text-sm sm:text-lg lg:text-xl font-black tabular-nums text-white">
                  {currencySymbol}{currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className={cn("text-[9px] sm:text-[10px] font-extrabold flex items-center tabular-nums mt-0.5", isPositive ? "text-emerald-500" : "text-rose-500")}>
                  {isPositive ? '+' : ''}{currentChange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isPositive ? '+' : ''}{currentChangePercent.toFixed(2)}%)
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Panel Overlay Switches (Desktop Only) */}
            {!isMobile && (
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
            )}

            {/* Grid Switchers (Desktop Only, symbol required) */}
            {selectedSymbol && !isMobile && (
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

            {/* Live blinking feed dot */}
            <div className="flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
               <span className="w-1 h-1 rounded-full bg-emerald-500 mr-1 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
               <span className="text-[8px] font-black tracking-wide text-emerald-400">LIVE</span>
            </div>
          </div>
        </div>

      </div>

      {/* Premium Glassmorphic Mobile Navigation Bar */}
      {isMobile && (
        <div className="bg-[#090d16]/95 border-t border-slate-800/80 px-4 py-2 flex items-center justify-around z-40 shrink-0 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={cn(
              "flex flex-col items-center gap-1.5 py-1 px-4 rounded-xl transition-all select-none",
              activeTab === 'watchlist' 
                ? "text-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.1)] border border-primary/20" 
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <List className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Watchlist</span>
          </button>
          
          <button
            onClick={() => setActiveTab('chart')}
            className={cn(
              "flex flex-col items-center gap-1.5 py-1 px-4 rounded-xl transition-all select-none",
              activeTab === 'chart' 
                ? "text-emerald-400 bg-emerald-400/10 shadow-[0_0_15px_rgba(52,211,153,0.1)] border border-emerald-400/20" 
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Chart</span>
          </button>

          <button
            onClick={() => setActiveTab('trade')}
            className={cn(
              "flex flex-col items-center gap-1.5 py-1 px-4 rounded-xl transition-all select-none",
              activeTab === 'trade' 
                ? "text-rose-400 bg-rose-400/10 shadow-[0_0_15px_rgba(244,63,94,0.1)] border border-rose-400/20" 
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <ArrowUpDown className="w-5 h-5" />
            <span className="text-[9px] font-black uppercase tracking-widest">Trade</span>
          </button>
        </div>
      )}

      {/* Dynamic Premium Glassmorphic Footer */}
      <Footer />
    </div>
  );
}
