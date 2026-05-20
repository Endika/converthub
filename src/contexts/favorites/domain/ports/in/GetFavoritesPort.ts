import type { Favorite } from '../../model/Favorite';

export interface GetFavoritesPort {
  execute(): readonly Favorite[];
}
