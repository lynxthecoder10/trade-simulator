import { create } from 'zustand';
import { globalEventBus, EventType } from '@trade/event-bus';
import { globalPortfolioManager } from '@trade/portfolio-engine';
import { globalRiskEngine } from '@trade/risk-engine';

export interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  unrealizedPnl: number;
}

interface PortfolioState {
  balance: number;
  positions: Position[];
  initialize: () => void;
  sendOrder: (symbol: string, quantity: number, price: number, isBuy: boolean, isIntraday?: boolean) => { success: boolean, reason?: string };
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  balance: 100000,
  positions: [],
  initialize: () => {
    // Sync initial state
    set({ balance: globalPortfolioManager.getBalance() });

    // Subscribe to balance changes
    globalEventBus.subscribe(EventType.BALANCE_UPDATED, (payload: any) => {
      set({ balance: payload.newBalance });
    });

    // Subscribe to position updates
    globalEventBus.subscribe(EventType.POSITION_UPDATED, (payload: any) => {
      set((state) => {
        const existingIdx = state.positions.findIndex(p => p.symbol === payload.symbol);
        if (payload.quantity === 0) {
          return { positions: state.positions.filter(p => p.symbol !== payload.symbol) };
        }
        
        const newPosition: Position = {
          symbol: payload.symbol,
          quantity: payload.quantity,
          averagePrice: payload.averagePrice,
          currentPrice: payload.currentPrice || (existingIdx !== -1 ? state.positions[existingIdx].currentPrice : 0),
          unrealizedPnl: payload.unrealizedPnl || 0
        };

        if (existingIdx !== -1) {
          const newPositions = [...state.positions];
          newPositions[existingIdx] = newPosition;
          return { positions: newPositions };
        } else {
          return { positions: [...state.positions, newPosition] };
        }
      });
    });

    // Subscribe to price ticks to update unrealized pnl locally for smooth UI
    globalEventBus.subscribe(EventType.MARKET_TICK, (payload: any) => {
      set((state) => ({
        positions: state.positions.map(p => {
          if (p.symbol === payload.symbol) {
            const unrealizedPnl = (payload.price - p.averagePrice) * p.quantity;
            return { ...p, currentPrice: payload.price, unrealizedPnl };
          }
          return p;
        })
      }));
    });
  },
  sendOrder: (symbol, quantity, price, isBuy, isIntraday = false) => {
    const { balance } = get();
    
    // Risk Check
    const riskCheck = globalRiskEngine.validateOrder(symbol, quantity, price, isIntraday, balance);
    if (!riskCheck.isValid) {
      return { success: false, reason: riskCheck.reason };
    }

    // Publish Order
    globalEventBus.publish(EventType.ORDER_PLACED, {
      orderId: Math.random().toString(36).substr(2, 9),
      symbol,
      quantity,
      limitPrice: price,
      side: isBuy ? 'buy' : 'sell',
      type: 'limit',
      timestamp: Date.now()
    });

    return { success: true };
  }
}));
