import { globalEventBus, EventType } from '@trade/event-bus';
import { globalClock } from '@trade/simulation-clock';
import { PositionEngine } from './position-engine';
import { PnLEngine } from './pnl-engine';
import { BalanceEngine } from './balance-engine';

export class PortfolioManager {
  private positionEngine = new PositionEngine();
  private pnlEngine = new PnLEngine();
  private balanceEngine = new BalanceEngine();

  constructor() {
    this.setupSubscriptions();
  }

  private setupSubscriptions() {
    globalEventBus.subscribe(EventType.ORDER_FILLED, (payload) => {
      const { symbol, side, quantity, fillPrice, timestamp } = payload;
      
      const previousPos = this.positionEngine.getPosition(symbol);
      const prevQty = previousPos ? previousPos.quantity : 0;
      const prevAvgPrice = previousPos ? previousPos.averageEntryPrice : 0;

      const result = this.positionEngine.updatePosition(symbol, side, quantity, fillPrice);
      
      if (result.realizedPnl !== undefined) {
        this.balanceEngine.addRealizedPnL(result.realizedPnl);
        
        globalEventBus.publish(EventType.BALANCE_UPDATED, {
          newBalance: this.balanceEngine.getBalance(),
          delta: result.realizedPnl,
          reason: 'REALIZED_PNL',
          timestamp: globalClock.getCurrentTime()
        });

        // Publish TRADE_CLOSED event for the ledger
        globalEventBus.publish(EventType.TRADE_CLOSED, {
          symbol,
          side: prevQty > 0 ? 'sell' : 'buy', // Side closing the trade
          quantity: result.closedQuantity,
          entryPrice: prevAvgPrice,
          exitPrice: fillPrice,
          pnl: result.realizedPnl,
          durationMs: 0, // Compute duration later if needed by tracking entry time
          timestamp: globalClock.getCurrentTime()
        });
      }

      globalEventBus.publish(EventType.POSITION_UPDATED, {
        symbol,
        quantity: result.position.quantity,
        averagePrice: result.position.averageEntryPrice,
        realizedPnl: result.realizedPnl
      });
    });
  }

  public getBalance(): number {
    return this.balanceEngine.getBalance();
  }
}

export const globalPortfolioManager = new PortfolioManager();
