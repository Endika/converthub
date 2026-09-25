import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { StorageWriteError } from '../../../../../shared-kernel/domain/StorageWriteError';
import type { TravelNote } from '../../model/TravelNote';

export interface NotesRepositoryPort {
  loadAll(): TravelNote[];
  saveAll(notes: readonly TravelNote[]): Result<void, StorageWriteError>;
}
