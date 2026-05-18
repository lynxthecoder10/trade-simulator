'use client';

import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/stores/market-store';
import { usePortfolioStore } from '@/stores/portfolio-store';
import { MarketEngine } from '@/lib/mock-market';
import { globalSignalEngine } from '@trade/signal-engine';
import { globalBehaviorTracker } from '@trade/behavior-tracker';
import { globalBehaviorEngine } from '@trade/behavior-engine';
import { globalExecutionEngine } from '@trade/execution-engine';

export function SimulationBridge({ children }: { children: React.ReactNode }) {
  const initialized = useRef(false);
  const engineRef = useRef<MarketEngine | null>(null);
  const initializeMarket = useMarketStore(state => state.initialize);
  const setEngine = useMarketStore(state => state.setEngine);
  const initializePortfolio = usePortfolioStore(state => state.initialize);

  useEffect(() => {
    if (initialized.current) return;
    
    // Initialize Stores (Subscribes to Bus)
    initializeMarket();
    initializePortfolio();

    const defaultSymbols = [
      'RELIANCE.NS',
      'TCS.NS',
      'HDFCBANK.NS',
      'INFY.NS',
      'ICICIBANK.NS',
      'AAPL',
      'TSLA',
      'BTC-USD'
    ];

    // Initialize Market Engine with Real-World Yahoo Finance symbols
    const marketEngine = new MarketEngine(defaultSymbols);
    
    // Start polling loop using user-configured tick speed from settings if present
    let initialTickSpeed = 3;
    if (typeof window !== 'undefined') {
      const savedSpeed = localStorage.getItem('trade_tick_speed');
      if (savedSpeed) {
        initialTickSpeed = Number(savedSpeed);
      }
    }
    marketEngine.start(initialTickSpeed * 1000);
    engineRef.current = marketEngine;
    
    // Pass the engine reference to our global store
    setEngine(marketEngine);

    // Initialize default watchlist items in the store
    const initialWatchlist = defaultSymbols.map(sym => ({
      symbol: sym,
      price: 0,
      change: 0,
      changePercent: 0
    }));
    useMarketStore.getState().setWatchlist(initialWatchlist);

    // Force initialization of other singletons
    const engines = {
      signal: !!globalSignalEngine,
      tracker: !!globalBehaviorTracker,
      behavior: !!globalBehaviorEngine,
      execution: !!globalExecutionEngine
    };

    console.log('Real-Time Yahoo Finance Integration Active. Core Engines:', engines);

    // Register PWA Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('PWA Service Worker registered successfully:', reg.scope))
        .catch((err) => console.error('PWA Service Worker registration failed:', err));
    }

    initialized.current = true;

    return () => {
      marketEngine.stop();
      setEngine(null);
    };
  }, [initializeMarket, initializePortfolio, setEngine]);

  return <>{children}</>;
}
