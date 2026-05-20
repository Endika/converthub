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

  it('round-trips favorites', () => {
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
  });

  it('returns [] for malformed JSON', () => {
    storage.setItem('converthub:favorites', 'not-json');
    expect(repo.loadAll()).toEqual([]);
  });

  it('drops items with invalid shape', () => {
    storage.setItem(
      'converthub:favorites',
      JSON.stringify([{ id: '1', bogus: true }]),
    );
    expect(repo.loadAll()).toEqual([]);
  });

  it('returns [] when stored JSON is not an array', () => {
    storage.setItem('converthub:favorites', JSON.stringify({ foo: 'bar' }));
    expect(repo.loadAll()).toEqual([]);
  });

  it('drops null entries inside the array', () => {
    storage.setItem('converthub:favorites', JSON.stringify([null]));
    expect(repo.loadAll()).toEqual([]);
  });

  it('defaults to global localStorage when no storage injected', () => {
    const r = new LocalStorageFavoritesRepository();
    r.saveAll([]);
    expect(r.loadAll()).toEqual([]);
    localStorage.removeItem('converthub:favorites');
  });
});
