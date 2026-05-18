export interface Position {
  symbol: string;
  quantity: number; // positive for long, negative for short
  averageEntryPrice: number;
}

export class PositionEngine {
  private positions: Map<string, Position> = new Map();

  getPosition(symbol: string): Position | undefined {
    return this.positions.get(symbol);
  }

  updatePosition(symbol: string, side: 'buy'|'sell', quantity: number, fillPrice: number): { position: Position, realizedPnl?: number, closedQuantity: number } {
    const qtyChange = side === 'buy' ? quantity : -quantity;
    let pos = this.positions.get(symbol);
    
    if (!pos) {
      pos = { symbol, quantity: qtyChange, averageEntryPrice: fillPrice };
      this.positions.set(symbol, pos);
      return { position: pos, closedQuantity: 0 };
    }

    let realizedPnl = undefined;
    let closedQuantity = 0;

    // Check if trade closes existing position
    if ((pos.quantity > 0 && side === 'sell') || (pos.quantity < 0 && side === 'buy')) {
      closedQuantity = Math.min(Math.abs(pos.quantity), quantity);
      const isLong = pos.quantity > 0;
      
      // Calculate Realized PnL for the closed portion
      realizedPnl = isLong 
        ? (fillPrice - pos.averageEntryPrice) * closedQuantity
        : (pos.averageEntryPrice - fillPrice) * closedQuantity;
    }

    // Update Average Entry Price for newly opened quantity
    const newQuantity = pos.quantity + qtyChange;
    
    // If direction changes, reset average price
    if (Math.sign(pos.quantity) !== Math.sign(newQuantity) && newQuantity !== 0) {
      pos.averageEntryPrice = fillPrice;
    } else if (Math.sign(pos.quantity) === Math.sign(qtyChange)) {
      // Adding to existing position
      const totalValue = Math.abs(pos.quantity) * pos.averageEntryPrice + quantity * fillPrice;
      pos.averageEntryPrice = totalValue / Math.abs(newQuantity);
    }

    pos.quantity = newQuantity;

    if (pos.quantity === 0) {
      this.positions.delete(symbol);
    }

    return { position: pos, realizedPnl, closedQuantity };
  }

  reset() {
    this.positions.clear();
  }
}
