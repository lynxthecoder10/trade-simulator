import { MarketPhase, Tick } from '../types';
import { generateNextTick } from '../generators/priceGenerator';

export type Subscriber = (tick: Tick) => void;

export interface AssetConfig {
  symbol: string;
  basePrice: number;
  volatility: number;
  drift: number;
}

export class MarketEngine {
  private assets: Map<string, AssetConfig> = new Map();
  private prices: Map<string, number> = new Map();
  private phase: MarketPhase = 'SIDEWAYS';
  private subscribers: Set<Subscriber> = new Set();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private phaseTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(initialAssets: AssetConfig[]) {
    initialAssets.forEach(asset => {
      this.assets.set(asset.symbol, asset);
      this.prices.set(asset.symbol, asset.basePrice);
    });
  }

  public subscribe(callback: Subscriber) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  public start(tickRateMs: number = 1000) {
    if (this.intervalId) return;

    this.setRandomPhase();
    
    this.intervalId = setInterval(() => {
      this.tick();
    }, tickRateMs);
  }

  public stop() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.phaseTimeout) clearTimeout(this.phaseTimeout);
    this.intervalId = null;
  }

  private setRandomPhase() {
    const phases: MarketPhase[] = ['TRENDING_BULL', 'TRENDING_BEAR', 'SIDEWAYS', 'OPEN_VOLATILITY'];
    this.phase = phases[Math.floor(Math.random() * phases.length)];
    
    // Sometimes trigger a news spike
    if (Math.random() > 0.8) {
      this.phase = Math.random() > 0.5 ? 'NEWS_SPIKE_UP' : 'NEWS_SPIKE_DOWN';
      this.phaseTimeout = setTimeout(() => this.setRandomPhase(), 5000); // Spike lasts 5 seconds
      return;
    }

    // Normal phase lasts 30s to 2mins
    const duration = 30000 + Math.random() * 90000;
    this.phaseTimeout = setTimeout(() => this.setRandomPhase(), duration);
  }

  private tick() {
    this.assets.forEach((config, symbol) => {
      const currentPrice = this.prices.get(symbol)!;
      const nextPrice = generateNextTick({
        currentPrice,
        phase: this.phase,
        targetDrift: config.drift,
        volatility: config.volatility
      });

      this.prices.set(symbol, nextPrice);
      
      const volume = Math.floor(Math.random() * 100) + 1; // Fake volume
      
      const tick: Tick = {
        symbol,
        price: nextPrice,
        volume,
        timestamp: Date.now()
      };

      this.notify(tick);
    });
  }

  private notify(tick: Tick) {
    this.subscribers.forEach(sub => sub(tick));
  }
}
