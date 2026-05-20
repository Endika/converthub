export class PinnedCurrenciesFullError extends Error {
  readonly max: number;

  constructor(max: number) {
    super(`Cannot pin more than ${max} currencies`);
    this.name = 'PinnedCurrenciesFullError';
    this.max = max;
  }
}
