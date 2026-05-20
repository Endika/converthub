import { beforeEach, describe, expect, it } from 'vitest';
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
});
