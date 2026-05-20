import type { Favorite } from '../domain/model/Favorite';
import type { GetFavoritesPort } from '../domain/ports/in/GetFavoritesPort';
import type { FavoritesService } from '../domain/services/FavoritesService';

export class GetFavoritesUseCase implements GetFavoritesPort {
  constructor(private readonly service: FavoritesService) {}

  execute(): readonly Favorite[] {
    return this.service.list();
  }
}
