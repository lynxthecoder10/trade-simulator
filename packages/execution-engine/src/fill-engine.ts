import { Order, OrderState } from './order-types';

export class FillEngine {
  processMarketOrder(order: Order, currentPrice: number): { fillPrice: number, filledQuantity: number } {
    // Simple spread/slippage simulation based on user-configured settings
    let slippagePercent = 0.2; // default 0.2%
    if (typeof window !== 'undefined') {
      const savedSlippage = localStorage.getItem('trade_slippage');
      if (savedSlippage) {
        slippagePercent = parseFloat(savedSlippage);
      }
    }
    const maxSlippageBps = slippagePercent * 100;
    const slippageBps = Math.random() * maxSlippageBps; // 0 to max basis points
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
