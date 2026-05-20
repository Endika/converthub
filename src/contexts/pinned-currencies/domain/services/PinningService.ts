import { err, ok, type Result } from '../../../../shared-kernel/domain/Result';
import { PinnedCurrenciesFullError } from '../errors/PinnedCurrenciesFullError';
import { PinnedCurrency } from '../model/PinnedCurrency';
import type { PinnedCurrenciesRepositoryPort } from '../ports/out/PinnedCurrenciesRepositoryPort';

export const MAX_PINNED_CURRENCIES = 5;

export class PinningService {
  constructor(
    private readonly repository: PinnedCurrenciesRepositoryPort,
    private readonly maxItems: number = MAX_PINNED_CURRENCIES,
  ) {}

  pin(code: string): Result<void, PinnedCurrenciesFullError> {
    const current = this.repository.loadAll();
    if (current.some((p) => p.code === code)) return ok(undefined);
    if (current.length >= this.maxItems) {
      return err(new PinnedCurrenciesFullError(this.maxItems));
    }
    this.repository.saveAll([new PinnedCurrency(code), ...current]);
    return ok(undefined);
  }

  unpin(code: string): void {
    const current = this.repository.loadAll();
    this.repository.saveAll(current.filter((p) => p.code !== code));
  }

  list(): readonly PinnedCurrency[] {
    return this.repository.loadAll();
  }

  isPinned(code: string): boolean {
    return this.repository.loadAll().some((p) => p.code === code);
  }
}
