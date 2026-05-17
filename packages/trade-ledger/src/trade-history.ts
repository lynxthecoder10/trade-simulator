export interface TradeRecord {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  pnl: number;
  durationMs: number;
  timestamp: number;
}
