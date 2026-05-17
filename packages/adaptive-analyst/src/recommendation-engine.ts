import { globalProfileEngine } from '@trade/profile-engine';
import { globalBehaviorEngine, TradingPattern } from '@trade/behavior-engine';
import { ConfidenceLevel, Recommendation } from './types';

export class RecommendationEngine {
  generateRecommendation(symbol: string, currentVolatility: number, currentMomentum: number): Recommendation {
    const profile = globalProfileEngine.getProfile();
    const state = globalBehaviorEngine.evaluateCurrentState();
    const reasons: string[] = [];
    let score = 50; // Base score out of 100

    // Adjust based on market conditions
    if (currentVolatility > 0.8) {
      reasons.push('High market volatility detected');
      score -= 20;
    }

    if (currentMomentum > 0.7) {
      reasons.push('Strong positive momentum');
      score += 30;
    }

    // Adjust based on user profile
    if (profile.emotionalStability < 0.4) {
      reasons.push('Historical emotional instability limits confidence');
      score -= 20;
    }

    // Adjust based on real-time behavior
    if (state.patterns.includes(TradingPattern.REVENGE_TRADING)) {
      reasons.push('Warning: Potential revenge trading behavior detected. Wait for clear setup.');
      score -= 40;
    }

    if (state.patterns.includes(TradingPattern.OVERTRADING)) {
      reasons.push('Warning: Overtrading detected. Step back from the screen.');
      score -= 30;
    }

    let confidence = ConfidenceLevel.MEDIUM;
    if (score >= 80) confidence = ConfidenceLevel.HIGH;
    else if (score < 40) confidence = ConfidenceLevel.AVOID;
    else if (score < 60) confidence = ConfidenceLevel.LOW;

    return {
      symbol,
      confidence,
      reasons,
      timestamp: Date.now()
    };
  }
}
