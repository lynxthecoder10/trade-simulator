import { BehaviorRecord, BehaviorEvent } from '@trade/behavior-tracker';

export enum TradingPattern {
  REVENGE_TRADING = 'REVENGE_TRADING',
  OVERTRADING = 'OVERTRADING',
  CHASING_MARKET = 'CHASING_MARKET',
  DISCIPLINED_ENTRY = 'DISCIPLINED_ENTRY'
}

export class PsychologyAnalyzer {
  detectRevengeTrading(recentRecords: BehaviorRecord[]): boolean {
    // Sequence: PANIC_SELL (or big loss) followed very quickly by FOMO_ENTRY or TRADE_OPENED
    const losses = recentRecords.filter(r => r.type === BehaviorEvent.PANIC_SELL || (r.type === BehaviorEvent.TRADE_CLOSED && r.metadata?.pnl < 0));
    const entries = recentRecords.filter(r => r.type === BehaviorEvent.TRADE_OPENED || r.type === BehaviorEvent.FOMO_ENTRY);

    for (const loss of losses) {
      const immediateEntry = entries.find(e => e.timestamp > loss.timestamp && e.timestamp - loss.timestamp < 60000); // within 1 min
      if (immediateEntry) return true;
    }
    return false;
  }

  detectOvertrading(recentRecords: BehaviorRecord[], timeWindowMs: number = 300000): boolean {
    // For replay simulation, Date.now() should ideally be the globalClock.getCurrentTime()
    // but for prototype analysis we rely on relative timestamps.
    if (recentRecords.length === 0) return false;
    const now = recentRecords[recentRecords.length - 1].timestamp;
    const tradesInWindow = recentRecords.filter(r => r.type === BehaviorEvent.TRADE_OPENED && (now - r.timestamp) <= timeWindowMs);
    return tradesInWindow.length > 5; // More than 5 trades in 5 mins
  }
}
