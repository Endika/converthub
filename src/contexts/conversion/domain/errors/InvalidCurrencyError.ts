export class InvalidCurrencyError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(`Invalid currency code: ${code}`);
    this.name = 'InvalidCurrencyError';
    this.code = code;
  }
}
