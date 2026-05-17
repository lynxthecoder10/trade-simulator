export class ExposureValidator {
  validateExposure(
    totalPortfolioValue: number, 
    currentAssetExposure: number, 
    newTradeValue: number,
    maxConcentrationPercent: number
  ): { isValid: boolean, reason?: string } {
    const expectedExposure = currentAssetExposure + newTradeValue;
    const maxAllowedExposure = totalPortfolioValue * maxConcentrationPercent;

    if (expectedExposure > maxAllowedExposure) {
      return {
        isValid: false,
        reason: `Exceeds max concentration of ${maxConcentrationPercent * 100}%`
      };
    }

    return { isValid: true };
  }
}
