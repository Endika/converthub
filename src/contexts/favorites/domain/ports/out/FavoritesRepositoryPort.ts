import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { StorageWriteError } from '../../../../../shared-kernel/domain/StorageWriteError';
import type { Favorite } from '../../model/Favorite';

export interface FavoritesRepositoryPort {
  loadAll(): Favorite[];
  saveAll(favorites: readonly Favorite[]): Result<void, StorageWriteError>;
}
