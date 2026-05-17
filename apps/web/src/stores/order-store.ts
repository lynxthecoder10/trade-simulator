import { create } from 'zustand';

interface OrderState {
  side: 'buy' | 'sell';
  orderType: 'market' | 'limit';
  quantity: number;
  limitPrice: number | null;
  setSide: (side: 'buy' | 'sell') => void;
  setOrderType: (type: 'market' | 'limit') => void;
  setQuantity: (qty: number) => void;
  setLimitPrice: (price: number | null) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  side: 'buy',
  orderType: 'market',
  quantity: 1,
  limitPrice: null,
  setSide: (side) => set({ side }),
  setOrderType: (type) => set({ orderType: type }),
  setQuantity: (qty) => set({ quantity: qty }),
  setLimitPrice: (price) => set({ limitPrice: price }),
}));
