import { create } from 'zustand';
import { globalEventBus, EventType } from '@trade/event-bus';
import { MarketEngine } from '@/lib/mock-market';

export interface WatchlistItem {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

interface MarketState {
  watchlist: WatchlistItem[];
  engine: MarketEngine | null;
  setEngine: (engine: MarketEngine | null) => void;
  updateTick: (symbol: string, price: number, change?: number, changePercent?: number) => void;
  setWatchlist: (items: WatchlistItem[]) => void;
  addSymbol: (symbol: string) => void;
  removeSymbol: (symbol: string) => void;
  initialize: () => void;
}

export const useMarketStore = create<MarketState>((set, get) => ({
  watchlist: [],
  engine: null,
  setEngine: (engine) => set({ engine }),
  updateTick: (symbol, price, change = 0, changePercent = 0) => set((state) => {
    // If the symbol is not in the watchlist, add it dynamically!
    const exists = state.watchlist.some(item => item.symbol === symbol);
    if (!exists) {
      return {
        watchlist: [...state.watchlist, { symbol, price, change, changePercent }]
      };
    }

    return {
      watchlist: state.watchlist.map(item => {
        if (item.symbol === symbol) {
          // If change and changePercent are explicitly passed from Yahoo, use them!
          // Otherwise calculate based on previous price
          const finalChange = change !== 0 ? change : (price - item.price);
          const finalChangePercent = changePercent !== 0 ? changePercent : (item.price !== 0 ? (finalChange / item.price) * 100 : 0);
          return { ...item, price, change: finalChange, changePercent: finalChangePercent };
        }
        return item;
      })
    };
  }),
  setWatchlist: (items) => set({ watchlist: items }),
  addSymbol: (symbol) => {
    const cleanSymbol = symbol.toUpperCase().trim();
    if (!cleanSymbol) return;

    const state = get();
    const exists = state.watchlist.some(item => item.symbol === cleanSymbol);
    if (exists) return;

    // Add to local state first
    set({
      watchlist: [...state.watchlist, { symbol: cleanSymbol, price: 0, change: 0, changePercent: 0 }]
    });

    // Register with running polling engine
    if (state.engine) {
      state.engine.addSymbol(cleanSymbol);
    }
  },
  removeSymbol: (symbol) => {
    const state = get();
    set({
      watchlist: state.watchlist.filter(item => item.symbol !== symbol)
    });

    if (state.engine) {
      state.engine.removeSymbol(symbol);
    }
  },
  initialize: () => {
    globalEventBus.subscribe(EventType.MARKET_TICK, (payload: any) => {
      get().updateTick(payload.symbol, payload.price, payload.change, payload.changePercent);
    });
  }
}));
