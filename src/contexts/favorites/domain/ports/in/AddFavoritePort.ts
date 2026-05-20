import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { FavoritesFullError } from '../../errors/FavoritesFullError';
import type { Favorite } from '../../model/Favorite';

export interface AddFavoritePort {
  execute(favorite: Favorite): Result<void, FavoritesFullError>;
}
