export class ExchangeRateFetchError extends Error {
  readonly reason: string;

  constructor(reason: string) {
    super(`Failed to fetch exchange rates: ${reason}`);
    this.name = 'ExchangeRateFetchError';
    this.reason = reason;
  }
}
