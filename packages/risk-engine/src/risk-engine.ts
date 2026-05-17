import { MarginValidator } from './margin-validator';
import { ExposureValidator } from './exposure-validator';
import { RiskConfig, DEFAULT_RISK_CONFIG } from './risk-rules';

export class RiskEngine {
  private marginValidator = new MarginValidator();
  private exposureValidator = new ExposureValidator();
  private config: RiskConfig;

  constructor(config: RiskConfig = DEFAULT_RISK_CONFIG) {
    this.config = config;
  }

  validateOrder(
    symbol: string, 
    quantity: number, 
    price: number, 
    isIntraday: boolean, 
    currentBalance: number
  ): { isValid: boolean; reason?: string } {
    const leverage = isIntraday ? this.config.maxLeverage : 1;
    
    const marginCheck = this.marginValidator.validateMargin(currentBalance, quantity, price, leverage);
    
    if (!marginCheck.isValid) {
      return { isValid: false, reason: marginCheck.reason };
    }

    return { isValid: true };
  }
}

export const globalRiskEngine = new RiskEngine();
