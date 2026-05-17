import { globalEventBus, EventType } from '@trade/event-bus';
import { TradeRecord } from './trade-history';
import { TransactionRecord } from './transaction-log';

export class Ledger {
  private trades: TradeRecord[] = [];
  private transactions: TransactionRecord[] = [];

  constructor() {
    this.setupSubscriptions();
  }

  private setupSubscriptions() {
    globalEventBus.subscribe(EventType.TRADE_CLOSED, (payload) => {
      this.trades.push({
        id: crypto.randomUUID(),
        symbol: payload.symbol,
        side: payload.side,
        quantity: payload.quantity,
        entryPrice: payload.entryPrice,
        exitPrice: payload.exitPrice,
        pnl: payload.pnl,
        durationMs: payload.durationMs,
        timestamp: payload.timestamp
      });
    });

    globalEventBus.subscribe(EventType.BALANCE_UPDATED, (payload) => {
      this.transactions.push({
        id: crypto.randomUUID(),
        type: payload.reason === 'REALIZED_PNL' ? 'REALIZED_PNL' : 'DEPOSIT', // Simplification
        amount: payload.delta,
        balanceAfter: payload.newBalance,
        timestamp: payload.timestamp,
        description: payload.reason
      });
    });
  }

  getTrades(): TradeRecord[] {
    return [...this.trades];
  }

  getTransactions(): TransactionRecord[] {
    return [...this.transactions];
  }

  exportData() {
    return {
      trades: this.trades,
      transactions: this.transactions
    };
  }
}

export const globalLedger = new Ledger();
