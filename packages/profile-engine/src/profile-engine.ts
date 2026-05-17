import { globalBehaviorEngine, TradingPattern } from '@trade/behavior-engine';
import { TraderProfile } from './profile-types';

export class ProfileEngine {
  private currentProfile: TraderProfile = {
    riskTolerance: 0.5,
    emotionalStability: 0.8,
    momentumPreference: 0.5,
    volatilityDiscipline: 0.5,
    tradeCount: 0
  };

  updateProfile() {
    this.currentProfile.tradeCount++;
    const state = globalBehaviorEngine.evaluateCurrentState();

    if (state.patterns.includes(TradingPattern.REVENGE_TRADING)) {
      this.currentProfile.emotionalStability = Math.max(0, this.currentProfile.emotionalStability - 0.1);
      this.currentProfile.volatilityDiscipline = Math.max(0, this.currentProfile.volatilityDiscipline - 0.05);
    }

    if (state.patterns.includes(TradingPattern.OVERTRADING)) {
      this.currentProfile.emotionalStability = Math.max(0, this.currentProfile.emotionalStability - 0.05);
      this.currentProfile.riskTolerance = Math.min(1, this.currentProfile.riskTolerance + 0.05);
    }

    if (state.patterns.includes(TradingPattern.DISCIPLINED_ENTRY)) {
      this.currentProfile.emotionalStability = Math.min(1, this.currentProfile.emotionalStability + 0.02);
      this.currentProfile.volatilityDiscipline = Math.min(1, this.currentProfile.volatilityDiscipline + 0.02);
    }
  }

  getProfile(): TraderProfile {
    return { ...this.currentProfile };
  }
}

export const globalProfileEngine = new ProfileEngine();
