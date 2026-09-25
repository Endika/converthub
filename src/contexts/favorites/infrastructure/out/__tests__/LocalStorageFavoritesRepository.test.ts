import { beforeEach, describe, expect, it } from 'vitest';
import { isErr } from '../../../../../shared-kernel/domain/Result';
import { StorageWriteError } from '../../../../../shared-kernel/domain/StorageWriteError';
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

  it('returns [] instead of crashing when getItem throws', () => {
    storage.getItem = () => {
      throw new Error('storage unavailable');
    };
    expect(repo.loadAll()).toEqual([]);
  });

  it('never calls setItem while loading', () => {
    storage.setItem('converthub:favorites', JSON.stringify([{ id: '1' }]));
    let writes = 0;
    const realSetItem = storage.setItem.bind(storage);
    storage.setItem = (k, v) => {
      writes += 1;
      realSetItem(k, v);
    };
    repo.loadAll();
    expect(writes).toBe(0);
  });

  it('reports a StorageWriteError and leaves the previous value untouched when setItem fails', () => {
    const kept = Favorite.create({
      type: 'money',
      fromUnit: 'USD',
      toUnit: 'EUR',
      label: 'kept',
    });
    repo.saveAll([kept]);
    storage.setItem = () => {
      throw new Error('quota exceeded');
    };
    const result = repo.saveAll([
      Favorite.create({
        type: 'money',
        fromUnit: 'USD',
        toUnit: 'JPY',
        label: 'lost',
      }),
    ]);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error).toBeInstanceOf(StorageWriteError);
    expect(repo.loadAll()[0]?.label).toBe('kept');
  });

  it('format guard: a literal snapshot of the current on-disk format loads back complete', () => {
    const snapshot = JSON.stringify([
      {
        id: 'f-1',
        type: 'money',
        fromUnit: 'USD',
        toUnit: 'EUR',
        label: '100 USD → EUR',
        amount: 100,
        createdAt: 1700000000000,
      },
    ]);
    storage.setItem('converthub:favorites', snapshot);
    const loaded = repo.loadAll();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.id).toBe('f-1');
    expect(loaded[0]?.type).toBe('money');
    expect(loaded[0]?.fromUnit).toBe('USD');
    expect(loaded[0]?.toUnit).toBe('EUR');
    expect(loaded[0]?.label).toBe('100 USD → EUR');
    expect(loaded[0]?.amount).toBe(100);
    expect(loaded[0]?.createdAt.getTime()).toBe(1700000000000);
  });

  it('format guard: a favorite saved through the real save path loads back with every field intact', () => {
    const fav = Favorite.create({
      type: 'money',
      fromUnit: 'GBP',
      toUnit: 'USD',
      label: 'GBP -> USD',
      amount: 50,
    });
    repo.saveAll([fav]);
    const loaded = repo.loadAll()[0];
    expect(loaded?.id).toBe(fav.id);
    expect(loaded?.type).toBe(fav.type);
    expect(loaded?.fromUnit).toBe(fav.fromUnit);
    expect(loaded?.toUnit).toBe(fav.toUnit);
    expect(loaded?.label).toBe(fav.label);
    expect(loaded?.amount).toBe(fav.amount);
    expect(loaded?.createdAt.getTime()).toBe(fav.createdAt.getTime());
  });
});
