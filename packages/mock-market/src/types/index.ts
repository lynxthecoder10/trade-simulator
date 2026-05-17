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
}

export interface Candle {
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
}
