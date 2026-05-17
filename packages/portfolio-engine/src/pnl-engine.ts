import { Position } from './position-engine';

export class PnLEngine {
  calculateUnrealizedPnL(position: Position, currentPrice: number): number {
    if (position.quantity === 0) return 0;
    
    const isLong = position.quantity > 0;
    const valueDiff = Math.abs(position.quantity) * Math.abs(currentPrice - position.averageEntryPrice);
    
    if (isLong) {
      return currentPrice > position.averageEntryPrice ? valueDiff : -valueDiff;
    } else {
      return currentPrice < position.averageEntryPrice ? valueDiff : -valueDiff;
    }
  }
}
