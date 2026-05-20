import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { FavoritesFullError } from '../../errors/FavoritesFullError';
import { Favorite } from '../../model/Favorite';
import type { FavoritesRepositoryPort } from '../../ports/out/FavoritesRepositoryPort';
import { FavoritesService } from '../FavoritesService';

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

describe('FavoritesService', () => {
  it('adds a favorite at the head', () => {
    const repo = buildRepo();
    const service = new FavoritesService(repo);
    const r = service.add(sample('a'));
    expect(isOk(r)).toBe(true);
    expect(service.list().map((f) => f.id)).toEqual(['a']);
  });

  it('returns FavoritesFullError when the cap is reached', () => {
    const initial = Array.from({ length: 3 }, (_, i) => sample(String(i)));
    const repo = buildRepo(initial);
    const service = new FavoritesService(repo, 3);
    const r = service.add(sample('new'));
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(FavoritesFullError);
    expect(service.list()).toHaveLength(3);
  });

  it('removes a favorite by id', () => {
    const repo = buildRepo([sample('a'), sample('b')]);
    const service = new FavoritesService(repo);
    service.remove('a');
    expect(service.list().map((f) => f.id)).toEqual(['b']);
  });

  it('removing a non-existent id is a no-op', () => {
    const repo = buildRepo([sample('a')]);
    const service = new FavoritesService(repo);
    service.remove('missing');
    expect(service.list()).toHaveLength(1);
  });
});
