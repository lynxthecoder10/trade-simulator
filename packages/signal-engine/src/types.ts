export enum SignalType {
  RSI_OVERBOUGHT = 'RSI_OVERBOUGHT',
  RSI_OVERSOLD = 'RSI_OVERSOLD',
  MA_CROSSOVER_BULLISH = 'MA_CROSSOVER_BULLISH',
  MA_CROSSOVER_BEARISH = 'MA_CROSSOVER_BEARISH',
  HIGH_VOLATILITY = 'HIGH_VOLATILITY',
  BREAKOUT_DETECTED = 'BREAKOUT_DETECTED'
}

export interface Signal {
  type: SignalType;
  symbol: string;
  confidence: number; // 0 to 1
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface Candle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
}
