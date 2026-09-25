import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { StorageWriteError } from '../../../../../shared-kernel/domain/StorageWriteError';
import type { FavoritesFullError } from '../../errors/FavoritesFullError';
import type { Favorite } from '../../model/Favorite';

export interface AddFavoritePort {
  execute(
    favorite: Favorite,
  ): Result<void, FavoritesFullError | StorageWriteError>;
}
