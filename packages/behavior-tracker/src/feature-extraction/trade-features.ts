import { BehaviorEvent, TradeFeatureContext } from '../types';

export class TradeFeatureExtractor {
  extractClosingFeatures(context: TradeFeatureContext): { events: BehaviorEvent[], metadata: any } {
    const events: BehaviorEvent[] = [BehaviorEvent.TRADE_CLOSED];
    const metadata: any = {};

    if (context.durationMs && context.durationMs < 10000) {
      events.push(BehaviorEvent.RAPID_BUY_SELL);
      metadata.rapidTrade = true;
    }

    if (context.pnl && context.pnl < -100 && context.durationMs && context.durationMs < 30000) {
       // Big loss + short time = possible panic sell
       events.push(BehaviorEvent.PANIC_SELL);
       metadata.panicSell = true;
    }

    return { events, metadata };
  }

  extractOpeningFeatures(context: TradeFeatureContext): { events: BehaviorEvent[], metadata: any } {
    const events: BehaviorEvent[] = [BehaviorEvent.TRADE_OPENED];
    const metadata: any = {};

    if (context.volatilityAtEntry && context.volatilityAtEntry > 0.8) {
      // High volatility entry implies chasing / FOMO
      events.push(BehaviorEvent.FOMO_ENTRY);
      metadata.fomo = true;
    }

    return { events, metadata };
  }
}
