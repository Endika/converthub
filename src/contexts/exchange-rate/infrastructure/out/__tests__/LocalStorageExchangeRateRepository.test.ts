import { beforeEach, describe, expect, it } from 'vitest';
import { ExchangeRateSnapshot } from '../../../domain/model/ExchangeRateSnapshot';
import { LocalStorageExchangeRateRepository } from '../LocalStorageExchangeRateRepository';

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

describe('LocalStorageExchangeRateRepository', () => {
  let storage: Storage;
  let repo: LocalStorageExchangeRateRepository;

  beforeEach(() => {
    storage = buildMemoryStorage();
    repo = new LocalStorageExchangeRateRepository(storage);
  });

  it('returns null when storage is empty', () => {
    expect(repo.load()).toBeNull();
  });

  it('round-trips a snapshot preserving base, rates and fetchedAt', () => {
    const fetched = new Date('2026-05-20T10:00:00Z');
    repo.save(
      new ExchangeRateSnapshot('USD', { EUR: 0.92, GBP: 0.79 }, fetched),
    );
    const loaded = repo.load();
    expect(loaded?.baseCurrency).toBe('USD');
    expect(loaded?.rates).toEqual({ EUR: 0.92, GBP: 0.79 });
    expect(loaded?.fetchedAt.getTime()).toBe(fetched.getTime());
  });

  it('returns null for any malformed or unexpected stored shape', () => {
    storage.setItem('converthub:rates', 'not-json');
    expect(repo.load()).toBeNull();
    storage.setItem('converthub:rates', JSON.stringify({ foo: 'bar' }));
    expect(repo.load()).toBeNull();
    storage.setItem('converthub:rates', 'null');
    expect(repo.load()).toBeNull();
  });
});
