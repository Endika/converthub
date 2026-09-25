import { beforeEach, describe, expect, it } from 'vitest';
import { isErr } from '../../../../../shared-kernel/domain/Result';
import { StorageWriteError } from '../../../../../shared-kernel/domain/StorageWriteError';
import { PinnedCurrency } from '../../../domain/model/PinnedCurrency';
import { LocalStoragePinnedCurrenciesRepository } from '../LocalStoragePinnedCurrenciesRepository';

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

describe('LocalStoragePinnedCurrenciesRepository', () => {
  let storage: Storage;
  let repo: LocalStoragePinnedCurrenciesRepository;

  beforeEach(() => {
    storage = buildMemoryStorage();
    repo = new LocalStoragePinnedCurrenciesRepository(storage);
  });

  it('returns [] when storage is empty', () => {
    expect(repo.loadAll()).toEqual([]);
  });

  it('round-trips pinned currencies preserving order and codes', () => {
    repo.saveAll([new PinnedCurrency('USD'), new PinnedCurrency('EUR')]);
    expect(repo.loadAll().map((p) => p.code)).toEqual(['USD', 'EUR']);
  });

  it('returns [] for any malformed or unexpected stored shape', () => {
    storage.setItem('converthub:pinned-currencies', 'not-json');
    expect(repo.loadAll()).toEqual([]);
    storage.setItem(
      'converthub:pinned-currencies',
      JSON.stringify({ foo: 'bar' }),
    );
    expect(repo.loadAll()).toEqual([]);
    storage.setItem(
      'converthub:pinned-currencies',
      JSON.stringify([{ foo: 1 }, null]),
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
    storage.setItem(
      'converthub:pinned-currencies',
      JSON.stringify([{ code: 'USD', pinnedAt: 1 }]),
    );
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
    repo.saveAll([new PinnedCurrency('USD')]);
    storage.setItem = () => {
      throw new Error('quota exceeded');
    };
    const result = repo.saveAll([new PinnedCurrency('EUR')]);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error).toBeInstanceOf(StorageWriteError);
    expect(repo.loadAll().map((p) => p.code)).toEqual(['USD']);
  });

  it('format guard: a literal snapshot of the current on-disk format loads back complete', () => {
    const snapshot = JSON.stringify([
      { code: 'USD', pinnedAt: 1700000000000 },
      { code: 'EUR', pinnedAt: 1700000100000 },
    ]);
    storage.setItem('converthub:pinned-currencies', snapshot);
    const loaded = repo.loadAll();
    expect(loaded).toHaveLength(2);
    expect(loaded[0]?.code).toBe('USD');
    expect(loaded[0]?.pinnedAt.getTime()).toBe(1700000000000);
    expect(loaded[1]?.code).toBe('EUR');
    expect(loaded[1]?.pinnedAt.getTime()).toBe(1700000100000);
  });

  it('format guard: a pin saved through the real save path loads back with every field intact', () => {
    const pin = new PinnedCurrency('GBP');
    repo.saveAll([pin]);
    const loaded = repo.loadAll()[0];
    expect(loaded?.code).toBe(pin.code);
    expect(loaded?.pinnedAt.getTime()).toBe(pin.pinnedAt.getTime());
  });
});
