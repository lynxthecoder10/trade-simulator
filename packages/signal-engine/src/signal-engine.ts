import { globalEventBus, EventType } from '@trade/event-bus';
import { RSI } from './indicators/rsi';
import { Candle, Signal } from './types';

export class SignalEngine {
  private rsiEngine = new RSI(14);
  private historicalData: Map<string, Candle[]> = new Map();

  constructor() {
    this.setupSubscriptions();
  }

  private setupSubscriptions() {
    globalEventBus.subscribe(EventType.MARKET_TICK, (payload) => {
      // In a real system, we'd batch ticks into candles. For now, simulate candle addition
      let history = this.historicalData.get(payload.symbol);
      if (!history) {
        history = [];
        this.historicalData.set(payload.symbol, history);
      }

      // Very simple pseudo-candle creation (each tick is a candle for prototype)
      history.push({
        open: payload.price,
        high: payload.price,
        low: payload.price,
        close: payload.price,
        volume: payload.volume,
        timestamp: payload.timestamp
      });

      // Keep last 100 candles
      if (history.length > 100) {
        history.shift();
      }

      this.analyzeMarket(payload.symbol, history);
    });
  }

  private analyzeMarket(symbol: string, history: Candle[]) {
    if (history.length < 15) return;

    const rsiSignal = this.rsiEngine.generateSignal(symbol, history);
    
    if (rsiSignal) {
      // Could broadcast this to the event bus or behavior engine
      // globalEventBus.publish('SIGNAL_GENERATED', rsiSignal);
    }
  }
}

export const globalSignalEngine = new SignalEngine();
