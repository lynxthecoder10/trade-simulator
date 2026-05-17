import { globalEventBus, EventType } from '@trade/event-bus';
import { globalClock } from '@trade/simulation-clock';

export type MarketPhase = 
  | 'PRE_MARKET'
  | 'OPEN_VOLATILITY'
  | 'TRENDING_BULL'
  | 'TRENDING_BEAR'
  | 'SIDEWAYS'
  | 'NEWS_SPIKE_UP'
  | 'NEWS_SPIKE_DOWN'
  | 'CLOSING';

export interface Tick {
  symbol: string;
  price: number;
  timestamp: number;
  volume: number;
  change?: number;
  changePercent?: number;
}

export interface AssetConfig {
  symbol: string;
  basePrice: number;
  volatility: number;
  drift: number;
}

type Subscriber = (tick: Tick) => void;

export class MarketEngine {
  private symbols: Set<string> = new Set();
  private prices: Map<string, number> = new Map();
  private subscribers: Set<Subscriber> = new Set();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isFetching: boolean = false;

  constructor(initialSymbols: string[] | AssetConfig[]) {
    initialSymbols.forEach(item => {
      if (typeof item === 'string') {
        this.symbols.add(item);
      } else if (item && typeof item === 'object' && item.symbol) {
        this.symbols.add(item.symbol);
      }
    });
  }

  public subscribe(callback: Subscriber) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  public addSymbol(symbol: string) {
    const cleanSymbol = symbol.toUpperCase().trim();
    if (!cleanSymbol) return;
    this.symbols.add(cleanSymbol);
    // Trigger immediate fetch for the new symbol
    this.tick();
  }

  public removeSymbol(symbol: string) {
    this.symbols.delete(symbol);
    this.prices.delete(symbol);
  }

  public start(tickRateMs: number = 3000) {
    if (this.intervalId) return;

    // Trigger initial tick immediately
    this.tick();

    this.intervalId = setInterval(() => {
      this.tick();
    }, tickRateMs);
  }

  public stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = null;
  }

  private async tick() {
    if (this.symbols.size === 0 || this.isFetching) return;

    this.isFetching = true;

    try {
      const symbolsArray = Array.from(this.symbols);
      const queryStr = symbolsArray.join(',');
      
      const response = await fetch(`/api/market?symbols=${encodeURIComponent(queryStr)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch real-time market quotes');
      }

      const quotes = await response.json();
      const timestamp = globalClock.getCurrentTime();

      quotes.forEach((q: any) => {
        const tick: Tick = {
          symbol: q.symbol,
          price: q.price,
          volume: q.volume || 100,
          timestamp,
          change: q.change,
          changePercent: q.changePercent
        };

        this.prices.set(q.symbol, q.price);

        // Publish to Global Event Bus
        globalEventBus.publish(EventType.MARKET_TICK, tick);

        // Notify local subscribers
        this.notify(tick);
      });
    } catch (error) {
      console.error('Yahoo Finance Market Engine Poll Error:', error);
    } finally {
      this.isFetching = false;
      // Note: We don't advance the simulation clock manually here as it ticks on its own schedule
      // but we keep the logic aligned with globalClock.
    }
  }

  private notify(tick: Tick) {
    this.subscribers.forEach(sub => sub(tick));
  }
}
