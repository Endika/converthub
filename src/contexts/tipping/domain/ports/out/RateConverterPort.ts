export interface RateConverterPort {
  // Returns null when no rate is available (offline first run, unknown pair, etc.).
  convert(amount: number, from: string, to: string): number | null;
}
