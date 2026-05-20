import type { Favorite } from '../../model/Favorite';

export interface FavoritesRepositoryPort {
  loadAll(): Favorite[];
  saveAll(favorites: readonly Favorite[]): void;
}
