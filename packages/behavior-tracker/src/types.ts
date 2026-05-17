export enum BehaviorEvent {
  TRADE_OPENED = 'TRADE_OPENED',
  TRADE_CLOSED = 'TRADE_CLOSED',
  RAPID_BUY_SELL = 'RAPID_BUY_SELL',
  HESITATION = 'HESITATION',
  PANIC_SELL = 'PANIC_SELL',
  FOMO_ENTRY = 'FOMO_ENTRY'
}

export interface BehaviorRecord {
  type: BehaviorEvent;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface TradeFeatureContext {
  symbol: string;
  entryPrice: number;
  exitPrice?: number;
  durationMs?: number;
  pnl?: number;
  volatilityAtEntry?: number;
}
