import type { Result } from '../../../shared-kernel/domain/Result';
import type { FavoritesFullError } from '../domain/errors/FavoritesFullError';
import type { Favorite } from '../domain/model/Favorite';
import type { AddFavoritePort } from '../domain/ports/in/AddFavoritePort';
import type { FavoritesService } from '../domain/services/FavoritesService';

export class AddFavoriteUseCase implements AddFavoritePort {
  constructor(private readonly service: FavoritesService) {}

  execute(favorite: Favorite): Result<void, FavoritesFullError> {
    return this.service.add(favorite);
  }
}
