import { globalEventBus, EventType } from '@trade/event-bus';
import { BehaviorEvent, BehaviorRecord } from './types';
import { TradeFeatureExtractor } from './feature-extraction/trade-features';

export class BehaviorTracker {
  private records: BehaviorRecord[] = [];
  private extractor = new TradeFeatureExtractor();

  constructor() {
    this.setupSubscriptions();
  }

  private setupSubscriptions() {
    globalEventBus.subscribe(EventType.ORDER_FILLED, (payload) => {
      const features = this.extractor.extractOpeningFeatures({
        symbol: payload.symbol,
        entryPrice: payload.fillPrice,
        // In real app, we fetch volatility from signal engine
        volatilityAtEntry: Math.random() // Mock
      });

      features.events.forEach(event => {
        this.track({
          type: event,
          timestamp: payload.timestamp,
          metadata: { ...features.metadata, symbol: payload.symbol, orderId: payload.orderId }
        });
      });
    });

    globalEventBus.subscribe(EventType.TRADE_CLOSED, (payload) => {
      const features = this.extractor.extractClosingFeatures({
        symbol: payload.symbol,
        entryPrice: payload.entryPrice,
        exitPrice: payload.exitPrice,
        durationMs: payload.durationMs,
        pnl: payload.pnl
      });

      features.events.forEach(event => {
        this.track({
          type: event,
          timestamp: payload.timestamp,
          metadata: { ...features.metadata, symbol: payload.symbol, pnl: payload.pnl }
        });
      });
    });
  }

  private track(record: BehaviorRecord) {
    this.records.push(record);
    // Could publish BEHAVIOR_LOGGED event here
  }

  getRecords(): BehaviorRecord[] {
    return [...this.records];
  }
}

export const globalBehaviorTracker = new BehaviorTracker();
