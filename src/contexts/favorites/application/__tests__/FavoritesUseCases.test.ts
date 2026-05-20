import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../shared-kernel/domain/Result';
import { FavoritesFullError } from '../../domain/errors/FavoritesFullError';
import { Favorite } from '../../domain/model/Favorite';
import type { FavoritesRepositoryPort } from '../../domain/ports/out/FavoritesRepositoryPort';
import { FavoritesService } from '../../domain/services/FavoritesService';
import { AddFavoriteUseCase } from '../AddFavoriteUseCase';
import { GetFavoritesUseCase } from '../GetFavoritesUseCase';
import { RemoveFavoriteUseCase } from '../RemoveFavoriteUseCase';

const buildRepo = (initial: Favorite[] = []): FavoritesRepositoryPort => {
  let state = initial;
  return {
    loadAll: () => [...state],
    saveAll: (favorites) => {
      state = [...favorites];
    },
  };
};

const sample = (id: string): Favorite =>
  new Favorite(id, {
    type: 'money',
    fromUnit: 'USD',
    toUnit: 'EUR',
    label: id,
    createdAt: new Date(),
  });

describe('Favorites use cases', () => {
  it('AddFavoriteUseCase persists a favorite', () => {
    const service = new FavoritesService(buildRepo());
    const r = new AddFavoriteUseCase(service).execute(sample('a'));
    expect(isOk(r)).toBe(true);
  });

  it('AddFavoriteUseCase surfaces FavoritesFullError', () => {
    const service = new FavoritesService(buildRepo([sample('a')]), 1);
    const r = new AddFavoriteUseCase(service).execute(sample('b'));
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(FavoritesFullError);
  });

  it('RemoveFavoriteUseCase deletes a favorite by id', () => {
    const service = new FavoritesService(buildRepo([sample('a'), sample('b')]));
    new RemoveFavoriteUseCase(service).execute('a');
    expect(service.list().map((f) => f.id)).toEqual(['b']);
  });

  it('GetFavoritesUseCase lists stored favorites', () => {
    const service = new FavoritesService(buildRepo([sample('a')]));
    expect(new GetFavoritesUseCase(service).execute()).toHaveLength(1);
  });
});
