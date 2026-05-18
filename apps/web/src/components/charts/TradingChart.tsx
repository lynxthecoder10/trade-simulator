'use client';

import React, { useEffect, useRef } from 'react';
import { useUiStore } from '@/stores/ui-store';

interface TradingChartProps {
  data?: any[];
  symbol?: string;
  heightClass?: string;
  grid?: number;
}

interface SingleChartWidgetProps {
  symbol: string;
  index: number;
}

function SingleChartWidget({ symbol, index }: SingleChartWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    containerRef.current.innerHTML = '';

    const widgetContainer = document.createElement('div');
    widgetContainer.id = `tv-widget-${symbol}-${index}`;
    widgetContainer.className = 'w-full h-full';
    containerRef.current.appendChild(widgetContainer);

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;

    let tvSymbol = symbol;
    if (symbol === 'RELIANCE') tvSymbol = 'NSE:RELIANCE';
    else if (symbol === 'TCS') tvSymbol = 'NSE:TCS';
    else if (symbol === 'HDFCBANK') tvSymbol = 'NSE:HDFCBANK';
    else if (symbol === 'INFY') tvSymbol = 'NSE:INFY';
    else if (symbol === 'ICICIBANK') tvSymbol = 'NSE:ICICIBANK';
    else if (symbol.endsWith('.NS')) tvSymbol = `NSE:${symbol.replace('.NS', '')}`;
    else if (symbol.endsWith('-USD')) tvSymbol = `BINANCE:${symbol.replace('-USD', 'USDT')}`;

    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": tvSymbol,
      "interval": "5",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "hide_side_toolbar": false,
      "allow_symbol_change": true,
      "calendar": false,
      "studies": [
        "RSI@tv-basicstudies"
      ],
      "support_host": "https://www.tradingview.com"
    });

    widgetContainer.appendChild(script);
  }, [symbol, index]);

  return (
    <div className="w-full h-full min-h-[250px] bg-[#090d16] border border-border/80 rounded-md overflow-hidden relative shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
      <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md border border-border/40 text-xs font-bold text-primary flex items-center gap-1.5 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        {symbol} (5M)
      </div>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}

export function TradingChart({ symbol: propSymbol, heightClass = 'h-[500px]', grid: propGrid }: TradingChartProps) {
  const { selectedSymbol, chartGrid } = useUiStore();

  const activeSymbol = propSymbol || selectedSymbol || 'RELIANCE';
  const activeGrid = propGrid || chartGrid || 1;

  // Symbols to display in grid modes
  const gridSymbols = [
    activeSymbol,
    'TCS',
    'INFY',
    'HDFCBANK'
  ];

  if (activeGrid === 2) {
    return (
      <div className={`w-full ${heightClass} grid grid-cols-1 md:grid-cols-2 gap-2 bg-[#020617] rounded-lg border border-border p-1.5 shadow-xl`}>
        <SingleChartWidget symbol={gridSymbols[0]} index={0} />
        <SingleChartWidget symbol={gridSymbols[1]} index={1} />
      </div>
    );
  }

  if (activeGrid === 4) {
    return (
      <div className={`w-full ${heightClass} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 grid-rows-2 gap-2 bg-[#020617] rounded-lg border border-border p-1.5 shadow-xl`}>
        <SingleChartWidget symbol={gridSymbols[0]} index={0} />
        <SingleChartWidget symbol={gridSymbols[1]} index={1} />
        <SingleChartWidget symbol={gridSymbols[2]} index={2} />
        <SingleChartWidget symbol={gridSymbols[3]} index={3} />
      </div>
    );
  }

  return (
    <div className={`w-full ${heightClass} bg-[#020617] rounded-lg border border-border overflow-hidden p-1.5 shadow-xl flex flex-col relative`}>
      <SingleChartWidget symbol={activeSymbol} index={0} />
    </div>
  );
}
