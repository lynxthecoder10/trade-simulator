import { globalEventBus, EventType } from '@trade/event-bus';
import { globalClock } from '@trade/simulation-clock';
import { Order, OrderState } from './order-types';
import { FillEngine } from './fill-engine';

export class ExecutionEngine {
  private activeOrders: Map<string, Order> = new Map();
  private fillEngine: FillEngine = new FillEngine();
  private currentPrices: Map<string, number> = new Map();

  constructor() {
    this.setupSubscriptions();
  }

  private setupSubscriptions() {
    globalEventBus.subscribe(EventType.MARKET_TICK, (payload) => {
      this.currentPrices.set(payload.symbol, payload.price);
      this.evaluatePendingOrders(payload.symbol, payload.price);
    });

    globalEventBus.subscribe(EventType.ORDER_PLACED, (payload) => {
      this.handleNewOrder(payload);
    });
  }

  private handleNewOrder(payload: any) {
    const side = (payload.side || 'buy').toLowerCase() as 'buy' | 'sell';
    const type = (payload.type || 'limit').toLowerCase() as 'market' | 'limit';
    const limitPrice = payload.limitPrice || payload.price;

    const order: Order = {
      id: payload.orderId,
      symbol: payload.symbol,
      side,
      type,
      quantity: payload.quantity,
      filledQuantity: 0,
      limitPrice,
      state: OrderState.PENDING,
      timestamp: payload.timestamp
    };

    const currentPrice = this.currentPrices.get(order.symbol);
    if (!currentPrice) {
      globalEventBus.publish(EventType.ORDER_REJECTED, {
        orderId: order.id,
        reason: 'Market price unavailable',
        timestamp: globalClock.getCurrentTime()
      });
      return;
    }

    if (order.type === 'market') {
      const fill = this.fillEngine.processMarketOrder(order, currentPrice);
      this.executeFill(order, fill.fillPrice, fill.filledQuantity);
    } else {
      this.activeOrders.set(order.id, order);
      this.evaluatePendingOrders(order.symbol, currentPrice);
    }
  }

  private evaluatePendingOrders(symbol: string, currentPrice: number) {
    for (const [id, order] of this.activeOrders.entries()) {
      if (order.symbol === symbol && order.state === OrderState.PENDING) {
        if (order.type === 'limit') {
          const fill = this.fillEngine.processLimitOrder(order, currentPrice);
          if (fill.fillPrice && fill.filledQuantity) {
            this.executeFill(order, fill.fillPrice, fill.filledQuantity);
            this.activeOrders.delete(id);
          }
        }
      }
    }
  }

  private executeFill(order: Order, fillPrice: number, filledQuantity: number) {
    order.state = OrderState.FILLED;
    order.filledQuantity = filledQuantity;
    
    globalEventBus.publish(EventType.ORDER_FILLED, {
      orderId: order.id,
      symbol: order.symbol,
      side: order.side,
      quantity: filledQuantity,
      fillPrice: fillPrice,
      timestamp: globalClock.getCurrentTime()
    });
  }
}

export const globalExecutionEngine = new ExecutionEngine();
