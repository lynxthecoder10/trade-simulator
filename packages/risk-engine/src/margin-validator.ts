export class MarginValidator {
  validateMargin(
    balance: number, 
    orderQuantity: number, 
    orderPrice: number, 
    leverage: number = 1
  ): { isValid: boolean, requiredMargin: number, reason?: string } {
    const tradeValue = orderQuantity * orderPrice;
    const requiredMargin = tradeValue / leverage;

    if (requiredMargin > balance) {
      return { 
        isValid: false, 
        requiredMargin, 
        reason: `Insufficient margin. Required: ${requiredMargin.toFixed(2)}, Available: ${balance.toFixed(2)}` 
      };
    }

    return { isValid: true, requiredMargin };
  }
}
