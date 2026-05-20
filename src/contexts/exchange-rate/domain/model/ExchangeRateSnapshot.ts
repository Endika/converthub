export type RateMap = Readonly<Record<string, number>>;

export class ExchangeRateSnapshot {
  readonly baseCurrency: string;
  readonly rates: RateMap;
  readonly fetchedAt: Date;

  constructor(baseCurrency: string, rates: Record<string, number>, fetchedAt: Date) {
    this.baseCurrency = baseCurrency;
    this.rates = Object.freeze({ ...rates });
    this.fetchedAt = fetchedAt;
  }

  getRate(currency: string): number | undefined {
    return this.rates[currency];
  }

  isStale(now: Date, maxAgeMs: number): boolean {
    return now.getTime() - this.fetchedAt.getTime() > maxAgeMs;
  }
}
