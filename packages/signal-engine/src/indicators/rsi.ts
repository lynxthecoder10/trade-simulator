import { Candle, Signal, SignalType } from '../types';

export class RSI {
  private period: number;
  
  constructor(period: number = 14) {
    this.period = period;
  }

  calculate(candles: Candle[]): number | null {
    if (candles.length <= this.period) return null;

    let gains = 0;
    let losses = 0;

    for (let i = 1; i <= this.period; i++) {
      const diff = candles[i].close - candles[i - 1].close;
      if (diff >= 0) gains += diff;
      else losses -= diff;
    }

    let avgGain = gains / this.period;
    let avgLoss = losses / this.period;

    for (let i = this.period + 1; i < candles.length; i++) {
      const diff = candles[i].close - candles[i - 1].close;
      if (diff >= 0) {
        avgGain = (avgGain * (this.period - 1) + diff) / this.period;
        avgLoss = (avgLoss * (this.period - 1)) / this.period;
      } else {
        avgGain = (avgGain * (this.period - 1)) / this.period;
        avgLoss = (avgLoss * (this.period - 1) - diff) / this.period;
      }
    }

    if (avgLoss === 0) return 100;
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  generateSignal(symbol: string, candles: Candle[]): Signal | null {
    const rsiValue = this.calculate(candles);
    if (rsiValue === null) return null;

    if (rsiValue >= 70) {
      return {
        type: SignalType.RSI_OVERBOUGHT,
        symbol,
        confidence: (rsiValue - 70) / 30, // scales up to 1 as it hits 100
        timestamp: candles[candles.length - 1].timestamp,
        metadata: { rsi: rsiValue }
      };
    } else if (rsiValue <= 30) {
      return {
        type: SignalType.RSI_OVERSOLD,
        symbol,
        confidence: (30 - rsiValue) / 30, // scales up to 1 as it hits 0
        timestamp: candles[candles.length - 1].timestamp,
        metadata: { rsi: rsiValue }
      };
    }

    return null;
  }
}
