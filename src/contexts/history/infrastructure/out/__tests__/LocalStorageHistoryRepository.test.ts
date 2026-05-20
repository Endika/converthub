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

  it('round-trips an entry preserving id, type and unit fields', () => {
    const entry = ConversionEntry.create({
      type: 'money',
      fromValue: '100',
      fromUnit: 'USD',
      toValue: '92',
      toUnit: 'EUR',
    });
    repo.saveAll([entry]);
    const loaded = repo.loadAll();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.id).toBe(entry.id);
    expect(loaded[0]?.fromUnit).toBe('USD');
    expect(loaded[0]?.toUnit).toBe('EUR');
  });

  it('returns [] for any malformed or unexpected stored shape', () => {
    storage.setItem('converthub:history', 'not-json');
    expect(repo.loadAll()).toEqual([]);
    storage.setItem('converthub:history', JSON.stringify({ foo: 'bar' }));
    expect(repo.loadAll()).toEqual([]);
    storage.setItem('converthub:history', JSON.stringify([{ id: '1' }, null]));
    expect(repo.loadAll()).toEqual([]);
  });
});
