import { RecommendationEngine } from './recommendation-engine';
import { Recommendation } from './types';

export class AdaptiveAnalyst {
  private engine = new RecommendationEngine();

  analyzeAsset(symbol: string, volatility: number, momentum: number): Recommendation {
    return this.engine.generateRecommendation(symbol, volatility, momentum);
  }
}

export const globalAdaptiveAnalyst = new AdaptiveAnalyst();
