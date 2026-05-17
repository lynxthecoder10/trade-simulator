export enum ConfidenceLevel {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
  AVOID = 'AVOID'
}

export interface Recommendation {
  symbol: string;
  confidence: ConfidenceLevel;
  reasons: string[];
  timestamp: number;
}
