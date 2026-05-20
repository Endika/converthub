export class InvalidAmountError extends Error {
  readonly amount: number;

  constructor(amount: number) {
    super(`Invalid amount: ${amount}`);
    this.name = 'InvalidAmountError';
    this.amount = amount;
  }
}
