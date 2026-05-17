export interface RiskConfig {
  maxLeverage: number; // e.g. 5x for intraday
  maxConcentrationPercent: number; // e.g. max 50% of portfolio in one asset
  maxDrawdownLimit: number; // e.g. stop trading if down 20%
}

export const DEFAULT_RISK_CONFIG: RiskConfig = {
  maxLeverage: 5,
  maxConcentrationPercent: 0.5,
  maxDrawdownLimit: 0.2
};
