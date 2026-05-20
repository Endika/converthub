import { err, ok, type Result } from '../../../../shared-kernel/domain/Result';
import { RateNotFoundError } from '../errors/RateNotFoundError';
import type { ExchangeRateRepositoryPort } from '../ports/out/ExchangeRateRepositoryPort';

export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export class ExchangeRateService {
  constructor(
    private readonly repository: ExchangeRateRepositoryPort,
    private readonly maxAgeMs: number = ONE_DAY_MS,
  ) {}

  getRate(currency: string): Result<number, RateNotFoundError> {
    const snapshot = this.repository.load();
    if (snapshot === null) return err(new RateNotFoundError(currency));
    const rate = snapshot.getRate(currency);
    if (rate === undefined) return err(new RateNotFoundError(currency));
    return ok(rate);
  }

  needsUpdate(now: Date = new Date()): boolean {
    const snapshot = this.repository.load();
    if (snapshot === null) return true;
    return snapshot.isStale(now, this.maxAgeMs);
  }

  getLastUpdatedAt(): Date | null {
    return this.repository.load()?.fetchedAt ?? null;
  }
}
