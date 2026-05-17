import { globalBehaviorTracker, BehaviorEvent } from '@trade/behavior-tracker';
import { PsychologyAnalyzer, TradingPattern } from './psychology/patterns';

export class BehaviorEngine {
  private analyzer = new PsychologyAnalyzer();

  evaluateCurrentState(): { patterns: TradingPattern[] } {
    const records = globalBehaviorTracker.getRecords();
    const recentRecords = records.slice(-20); // Analyze last 20 events

    const detectedPatterns: TradingPattern[] = [];

    if (this.analyzer.detectRevengeTrading(recentRecords)) {
      detectedPatterns.push(TradingPattern.REVENGE_TRADING);
    }

    if (this.analyzer.detectOvertrading(recentRecords)) {
      detectedPatterns.push(TradingPattern.OVERTRADING);
    }

    // Default good state
    if (detectedPatterns.length === 0 && records.filter(r => r.type === BehaviorEvent.TRADE_OPENED).length > 0) {
      detectedPatterns.push(TradingPattern.DISCIPLINED_ENTRY);
    }

    return { patterns: detectedPatterns };
  }
}

export const globalBehaviorEngine = new BehaviorEngine();
