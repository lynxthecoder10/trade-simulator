export enum OrderState {
  PENDING = 'PENDING',
  FILLED = 'FILLED',
  PARTIAL_FILL = 'PARTIAL_FILL',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  quantity: number;
  filledQuantity: number;
  limitPrice?: number;
  state: OrderState;
  timestamp: number;
}
