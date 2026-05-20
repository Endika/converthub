import type { PinnedCurrency } from '../../model/PinnedCurrency';

export interface PinnedCurrenciesRepositoryPort {
  loadAll(): PinnedCurrency[];
  saveAll(items: readonly PinnedCurrency[]): void;
}
