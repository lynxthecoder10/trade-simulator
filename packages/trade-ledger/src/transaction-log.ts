export interface TransactionRecord {
  id: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'REALIZED_PNL' | 'FEE';
  amount: number;
  balanceAfter: number;
  timestamp: number;
  description: string;
}
