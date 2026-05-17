export enum EventType {
  MARKET_TICK = 'MARKET_TICK',
  ORDER_PLACED = 'ORDER_PLACED',
  ORDER_FILLED = 'ORDER_FILLED',
  ORDER_REJECTED = 'ORDER_REJECTED',
  POSITION_UPDATED = 'POSITION_UPDATED',
  TRADE_CLOSED = 'TRADE_CLOSED',
  BALANCE_UPDATED = 'BALANCE_UPDATED',
  SESSION_STARTED = 'SESSION_STARTED',
  SESSION_ENDED = 'SESSION_ENDED',
  PRICE_ALERT_TRIGGERED = 'PRICE_ALERT_TRIGGERED'
}

export interface TradeEventPayloads {
  [EventType.MARKET_TICK]: { symbol: string; price: number; volume: number; timestamp: number };
  [EventType.ORDER_PLACED]: { orderId: string; symbol: string; side: 'buy' | 'sell'; quantity: number; type: 'market' | 'limit'; limitPrice?: number; timestamp: number };
  [EventType.ORDER_FILLED]: { orderId: string; symbol: string; side: 'buy' | 'sell'; quantity: number; fillPrice: number; timestamp: number };
  [EventType.ORDER_REJECTED]: { orderId: string; reason: string; timestamp: number };
  [EventType.POSITION_UPDATED]: { symbol: string; quantity: number; averagePrice: number; realizedPnl?: number };
  [EventType.TRADE_CLOSED]: { symbol: string; side: 'buy'|'sell'; quantity: number; entryPrice: number; exitPrice: number; pnl: number; durationMs: number; timestamp: number };
  [EventType.BALANCE_UPDATED]: { newBalance: number; delta: number; reason: string; timestamp: number };
  [EventType.SESSION_STARTED]: { phase: string; timestamp: number };
  [EventType.SESSION_ENDED]: { timestamp: number };
  [EventType.PRICE_ALERT_TRIGGERED]: { symbol: string; price: number; alertType: 'above' | 'below'; timestamp: number };
}
