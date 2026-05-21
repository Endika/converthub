export type InvalidTipInputField = 'bill' | 'tipPercent' | 'splitBetween';

export class InvalidTipInputError extends Error {
  readonly field: InvalidTipInputField;
  readonly value: number;

  constructor(field: InvalidTipInputField, value: number) {
    super(`Invalid tip input: ${field}=${value}`);
    this.name = 'InvalidTipInputError';
    this.field = field;
    this.value = value;
  }
}
