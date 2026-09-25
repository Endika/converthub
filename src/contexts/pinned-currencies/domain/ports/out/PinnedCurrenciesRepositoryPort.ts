import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { StorageWriteError } from '../../../../../shared-kernel/domain/StorageWriteError';
import type { PinnedCurrency } from '../../model/PinnedCurrency';

export interface PinnedCurrenciesRepositoryPort {
  loadAll(): PinnedCurrency[];
  saveAll(items: readonly PinnedCurrency[]): Result<void, StorageWriteError>;
}
