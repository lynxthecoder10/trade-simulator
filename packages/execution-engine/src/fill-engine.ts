import { Order, OrderState } from './order-types';

export class FillEngine {
  processMarketOrder(order: Order, currentPrice: number): { fillPrice: number, filledQuantity: number } {
    // Simple spread/slippage simulation
    const slippageBps = Math.random() * 5; // 0 to 5 basis points
    const slippageMultiplier = order.side === 'buy' ? (1 + slippageBps / 10000) : (1 - slippageBps / 10000);
    
    return {
      fillPrice: currentPrice * slippageMultiplier,
      filledQuantity: order.quantity
    };
  }

  processLimitOrder(order: Order, currentPrice: number): { fillPrice?: number, filledQuantity?: number } {
    if (!order.limitPrice) return {};
    
    // Check if limit price is hit
    const isHit = order.side === 'buy' ? currentPrice <= order.limitPrice : currentPrice >= order.limitPrice;
    
    if (isHit) {
      return {
        fillPrice: order.limitPrice,
        filledQuantity: order.quantity
      };
    }

    return {};
  }
}
