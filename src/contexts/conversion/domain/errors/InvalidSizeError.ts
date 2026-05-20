export class InvalidSizeError extends Error {
  readonly category: string;
  readonly region: string;
  readonly size: string;

  constructor(category: string, region: string, size: string) {
    super(`Size '${size}' not found in ${category}/${region}`);
    this.name = 'InvalidSizeError';
    this.category = category;
    this.region = region;
    this.size = size;
  }
}
