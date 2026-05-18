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
    // Strict input bounds, types, NaN, and negative parameters validation
    if (typeof quantity !== 'number' || isNaN(quantity) || !isFinite(quantity) || quantity <= 0) {
      return { isValid: false, reason: 'Invalid quantity: Must be a positive non-zero number' };
    }
    if (!Number.isInteger(quantity)) {
      return { isValid: false, reason: 'Invalid quantity: Fractional shares not supported in simulation' };
    }
    if (quantity > 10000000) {
      return { isValid: false, reason: 'Invalid quantity: Quantity exceeds maximum safety threshold' };
    }

    if (typeof price !== 'number' || isNaN(price) || !isFinite(price) || price <= 0) {
      return { isValid: false, reason: 'Invalid price: Must be a positive non-zero number' };
    }
    if (price > 100000000) {
      return { isValid: false, reason: 'Invalid price: Price exceeds maximum simulation limit' };
    }

    const leverage = isIntraday ? this.config.maxLeverage : 1;
    
    const marginCheck = this.marginValidator.validateMargin(currentBalance, quantity, price, leverage);
    
    if (!marginCheck.isValid) {
      return { isValid: false, reason: marginCheck.reason };
    }

    return { isValid: true };
  }
}

export const globalRiskEngine = new RiskEngine();
