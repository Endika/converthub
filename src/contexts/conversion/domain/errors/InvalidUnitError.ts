export class InvalidUnitError extends Error {
  readonly unit: string;
  readonly category: string;

  constructor(category: string, unit: string) {
    super(`Invalid ${category} unit: ${unit}`);
    this.name = 'InvalidUnitError';
    this.unit = unit;
    this.category = category;
  }
}
