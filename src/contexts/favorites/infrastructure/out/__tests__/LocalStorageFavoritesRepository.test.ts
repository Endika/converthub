import { beforeEach, describe, expect, it } from 'vitest';
import { Favorite } from '../../../domain/model/Favorite';
import { LocalStorageFavoritesRepository } from '../LocalStorageFavoritesRepository';

const buildMemoryStorage = (): Storage => {
  const data = new Map<string, string>();
  return {
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => {
      data.set(k, v);
    },
    removeItem: (k) => {
      data.delete(k);
    },
    clear: () => {
      data.clear();
    },
    key: (i) => Array.from(data.keys())[i] ?? null,
    get length() {
      return data.size;
    },
  };
};

describe('LocalStorageFavoritesRepository', () => {
  let storage: Storage;
  let repo: LocalStorageFavoritesRepository;

  beforeEach(() => {
    storage = buildMemoryStorage();
    repo = new LocalStorageFavoritesRepository(storage);
  });

  it('returns an empty list when storage is empty', () => {
    expect(repo.loadAll()).toEqual([]);
  });

  it('round-trips a favorite preserving label and unit fields', () => {
    const f = Favorite.create({
      type: 'money',
      fromUnit: 'USD',
      toUnit: 'EUR',
      label: 'USD -> EUR',
    });
    repo.saveAll([f]);
    const loaded = repo.loadAll();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.label).toBe('USD -> EUR');
    expect(loaded[0]?.fromUnit).toBe('USD');
  });

  it('returns [] for any malformed or unexpected stored shape', () => {
    storage.setItem('converthub:favorites', 'not-json');
    expect(repo.loadAll()).toEqual([]);
    storage.setItem('converthub:favorites', JSON.stringify({ foo: 'bar' }));
    expect(repo.loadAll()).toEqual([]);
    storage.setItem(
      'converthub:favorites',
      JSON.stringify([{ id: '1' }, null]),
    );
    expect(repo.loadAll()).toEqual([]);
  });
});
