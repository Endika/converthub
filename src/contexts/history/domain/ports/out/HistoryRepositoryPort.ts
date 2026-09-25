import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { StorageWriteError } from '../../../../../shared-kernel/domain/StorageWriteError';
import type { ConversionEntry } from '../../model/ConversionEntry';

export interface HistoryRepositoryPort {
  loadAll(): ConversionEntry[];
  saveAll(entries: readonly ConversionEntry[]): Result<void, StorageWriteError>;
}
