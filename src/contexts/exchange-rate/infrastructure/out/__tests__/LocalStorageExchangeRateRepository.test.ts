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

  it('returns null when nothing is stored', () => {
    expect(repo.load()).toBeNull();
  });

  it('round-trips a snapshot', () => {
    const fetched = new Date('2026-05-20T10:00:00Z');
    const snap = new ExchangeRateSnapshot('USD', { EUR: 0.92, GBP: 0.79 }, fetched);
    repo.save(snap);
    const loaded = repo.load();
    expect(loaded).not.toBeNull();
    expect(loaded?.baseCurrency).toBe('USD');
    expect(loaded?.rates).toEqual({ EUR: 0.92, GBP: 0.79 });
    expect(loaded?.fetchedAt.getTime()).toBe(fetched.getTime());
  });

  it('returns null for malformed JSON', () => {
    storage.setItem('converthub:rates', 'not-json');
    expect(repo.load()).toBeNull();
  });

  it('returns null for valid JSON with wrong shape', () => {
    storage.setItem('converthub:rates', JSON.stringify({ foo: 'bar' }));
    expect(repo.load()).toBeNull();
  });

  it('returns null when stored JSON parses to null', () => {
    storage.setItem('converthub:rates', 'null');
    expect(repo.load()).toBeNull();
  });

  it('defaults to global localStorage when no storage is injected', () => {
    const r = new LocalStorageExchangeRateRepository();
    const snap = new ExchangeRateSnapshot('USD', { EUR: 0.92 }, new Date());
    r.save(snap);
    expect(r.load()?.baseCurrency).toBe('USD');
    localStorage.removeItem('converthub:rates');
  });
});
