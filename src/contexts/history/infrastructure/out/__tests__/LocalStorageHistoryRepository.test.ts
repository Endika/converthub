import { beforeEach, describe, expect, it } from 'vitest';
import { ConversionEntry } from '../../../domain/model/ConversionEntry';
import { LocalStorageHistoryRepository } from '../LocalStorageHistoryRepository';

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

describe('LocalStorageHistoryRepository', () => {
  let storage: Storage;
  let repo: LocalStorageHistoryRepository;

  beforeEach(() => {
    storage = buildMemoryStorage();
    repo = new LocalStorageHistoryRepository(storage);
  });

  it('returns an empty list when storage is empty', () => {
    expect(repo.loadAll()).toEqual([]);
  });

  it('round-trips entries', () => {
    const e = ConversionEntry.create({
      type: 'money',
      fromValue: '100',
      fromUnit: 'USD',
      toValue: '92',
      toUnit: 'EUR',
    });
    repo.saveAll([e]);
    const loaded = repo.loadAll();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.id).toBe(e.id);
    expect(loaded[0]?.type).toBe('money');
  });

  it('returns [] for malformed JSON', () => {
    storage.setItem('converthub:history', 'not-json');
    expect(repo.loadAll()).toEqual([]);
  });

  it('drops items with invalid shape', () => {
    storage.setItem(
      'converthub:history',
      JSON.stringify([{ id: '1', bogus: true }]),
    );
    expect(repo.loadAll()).toEqual([]);
  });

  it('returns [] when stored JSON is not an array', () => {
    storage.setItem('converthub:history', JSON.stringify({ foo: 'bar' }));
    expect(repo.loadAll()).toEqual([]);
  });

  it('drops null entries inside the array', () => {
    storage.setItem('converthub:history', JSON.stringify([null]));
    expect(repo.loadAll()).toEqual([]);
  });

  it('defaults to global localStorage when no storage injected', () => {
    const r = new LocalStorageHistoryRepository();
    r.saveAll([]);
    expect(r.loadAll()).toEqual([]);
    localStorage.removeItem('converthub:history');
  });
});
