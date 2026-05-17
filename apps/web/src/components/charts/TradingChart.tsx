'use client';

import React, { useEffect, useRef } from 'react';
import { useUiStore } from '@/stores/ui-store';

interface TradingChartProps {
  data?: any[];
  symbol?: string;
}

export function TradingChart({ symbol: propSymbol }: TradingChartProps) {
  const { selectedSymbol } = useUiStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const activeSymbol = propSymbol || selectedSymbol || 'RELIANCE';

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget completely
    containerRef.current.innerHTML = '';

    // Create container for the TradingView Widget
    const widgetContainer = document.createElement('div');
    widgetContainer.id = `tv-widget-${activeSymbol}`;
    widgetContainer.className = 'w-full h-full';
    containerRef.current.appendChild(widgetContainer);

    // Create the script tag for the TV widget
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;

    // Standardize symbol notation for TradingView Widget
    let tvSymbol = activeSymbol;
    if (activeSymbol === 'RELIANCE') tvSymbol = 'NSE:RELIANCE';
    else if (activeSymbol === 'TCS') tvSymbol = 'NSE:TCS';
    else if (activeSymbol === 'HDFCBANK') tvSymbol = 'NSE:HDFCBANK';
    else if (activeSymbol === 'INFY') tvSymbol = 'NSE:INFY';
    else if (activeSymbol === 'ICICIBANK') tvSymbol = 'NSE:ICICIBANK';
    else if (activeSymbol.endsWith('.NS')) tvSymbol = `NSE:${activeSymbol.replace('.NS', '')}`;
    else if (activeSymbol.endsWith('-USD')) tvSymbol = `BINANCE:${activeSymbol.replace('-USD', 'USDT')}`;

    script.innerHTML = JSON.stringify({
      "autosize": true,
      "symbol": tvSymbol,
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "hide_side_toolbar": false,
      "allow_symbol_change": true,
      "calendar": false,
      "studies": [
        "RSI@tv-basicstudies",
        "MASimple@tv-basicstudies"
      ],
      "support_host": "https://www.tradingview.com"
    });

    widgetContainer.appendChild(script);
  }, [activeSymbol]);

  return (
    <div className="w-full h-[500px] bg-card rounded-lg border border-border overflow-hidden p-1 shadow-sm flex flex-col relative">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
