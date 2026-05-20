import type { RemoveFavoritePort } from '../domain/ports/in/RemoveFavoritePort';
import type { FavoritesService } from '../domain/services/FavoritesService';

export class RemoveFavoriteUseCase implements RemoveFavoritePort {
  constructor(private readonly service: FavoritesService) {}

  execute(id: string): void {
    this.service.remove(id);
  }
}
