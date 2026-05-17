export class BalanceEngine {
  private balance: number;

  constructor(initialBalance: number = 100000) {
    this.balance = initialBalance;
  }

  getBalance(): number {
    return this.balance;
  }

  addRealizedPnL(pnl: number) {
    this.balance += pnl;
  }

  debit(amount: number) {
    this.balance -= amount;
  }

  credit(amount: number) {
    this.balance += amount;
  }
}
