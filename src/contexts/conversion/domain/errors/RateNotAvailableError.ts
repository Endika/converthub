export class RateNotAvailableError extends Error {
  readonly currency: string;

  constructor(currency: string) {
    super(`Exchange rate not available for: ${currency}`);
    this.name = 'RateNotAvailableError';
    this.currency = currency;
  }
}
