import {
  err,
  ok,
  type Result,
} from '../../../../shared-kernel/domain/Result';
import { FavoritesFullError } from '../errors/FavoritesFullError';
import type { Favorite } from '../model/Favorite';
import type { FavoritesRepositoryPort } from '../ports/out/FavoritesRepositoryPort';

export const MAX_FAVORITES = 10;

export class FavoritesService {
  constructor(
    private readonly repository: FavoritesRepositoryPort,
    private readonly maxItems: number = MAX_FAVORITES,
  ) {}

  add(favorite: Favorite): Result<void, FavoritesFullError> {
    const current = this.repository.loadAll();
    if (current.length >= this.maxItems) {
      return err(new FavoritesFullError(this.maxItems));
    }
    this.repository.saveAll([favorite, ...current]);
    return ok(undefined);
  }

  remove(id: string): void {
    const current = this.repository.loadAll();
    this.repository.saveAll(current.filter((f) => f.id !== id));
  }

  list(): readonly Favorite[] {
    return this.repository.loadAll();
  }
}
