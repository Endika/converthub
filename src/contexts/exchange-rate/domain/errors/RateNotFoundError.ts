export class RateNotFoundError extends Error {
  readonly currency: string;

  constructor(currency: string) {
    super(`Rate not found for currency: ${currency}`);
    this.name = 'RateNotFoundError';
    this.currency = currency;
  }
}
