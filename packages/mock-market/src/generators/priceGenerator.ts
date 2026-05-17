import { MarketPhase } from '../types';

interface GeneratorState {
  currentPrice: number;
  phase: MarketPhase;
  targetDrift: number;
  volatility: number;
}

export function generateNextTick(state: GeneratorState): number {
  let { currentPrice, phase, targetDrift, volatility } = state;
  
  // Base random walk
  const randomShock = (Math.random() - 0.5) * 2;
  
  let drift = 0;
  let currentVolatility = volatility;

  switch (phase) {
    case 'PRE_MARKET':
      currentVolatility *= 0.2;
      break;
    case 'OPEN_VOLATILITY':
      currentVolatility *= 3.0;
      break;
    case 'TRENDING_BULL':
      drift = Math.abs(targetDrift);
      currentVolatility *= 0.8;
      break;
    case 'TRENDING_BEAR':
      drift = -Math.abs(targetDrift);
      currentVolatility *= 0.8;
      break;
    case 'SIDEWAYS':
      drift = 0;
      currentVolatility *= 0.5;
      break;
    case 'NEWS_SPIKE_UP':
      drift = currentPrice * 0.005; // 0.5% spike
      currentVolatility *= 4.0;
      break;
    case 'NEWS_SPIKE_DOWN':
      drift = -currentPrice * 0.005;
      currentVolatility *= 4.0;
      break;
    case 'CLOSING':
      currentVolatility *= 1.5;
      break;
  }

  // Next price = current + drift + random shock based on volatility
  const move = drift + (randomShock * currentVolatility);
  const nextPrice = currentPrice + move;

  // Prevent negative prices
  return Math.max(0.01, Number(nextPrice.toFixed(2)));
}
