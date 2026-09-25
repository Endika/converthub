import { beforeEach, describe, expect, it } from 'vitest';
import { isErr } from '../../../../../shared-kernel/domain/Result';
import { StorageWriteError } from '../../../../../shared-kernel/domain/StorageWriteError';
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

  it('returns [] instead of crashing when getItem throws', () => {
    storage.getItem = () => {
      throw new Error('storage unavailable');
    };
    expect(repo.loadAll()).toEqual([]);
  });

  it('never calls setItem while loading', () => {
    storage.setItem('converthub:history', JSON.stringify([{ id: '1' }]));
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
    const kept = ConversionEntry.create({
      type: 'money',
      fromValue: '1',
      fromUnit: 'USD',
      toValue: '1',
      toUnit: 'EUR',
    });
    repo.saveAll([kept]);
    storage.setItem = () => {
      throw new Error('quota exceeded');
    };
    const result = repo.saveAll([
      ConversionEntry.create({
        type: 'money',
        fromValue: '2',
        fromUnit: 'USD',
        toValue: '2',
        toUnit: 'EUR',
      }),
    ]);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error).toBeInstanceOf(StorageWriteError);
    expect(repo.loadAll()[0]?.id).toBe(kept.id);
  });

  it('format guard: a literal snapshot of the current on-disk format loads back complete', () => {
    const snapshot = JSON.stringify([
      {
        id: 'h-1',
        type: 'money',
        fromValue: '100',
        fromUnit: 'USD',
        toValue: '92',
        toUnit: 'EUR',
        timestamp: 1700000000000,
      },
    ]);
    storage.setItem('converthub:history', snapshot);
    const loaded = repo.loadAll();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.id).toBe('h-1');
    expect(loaded[0]?.type).toBe('money');
    expect(loaded[0]?.fromValue).toBe('100');
    expect(loaded[0]?.fromUnit).toBe('USD');
    expect(loaded[0]?.toValue).toBe('92');
    expect(loaded[0]?.toUnit).toBe('EUR');
    expect(loaded[0]?.timestamp.getTime()).toBe(1700000000000);
  });

  it('format guard: an entry saved through the real save path loads back with every field intact', () => {
    const entry = ConversionEntry.create({
      type: 'money',
      fromValue: '50',
      fromUnit: 'GBP',
      toValue: '63',
      toUnit: 'USD',
    });
    repo.saveAll([entry]);
    const loaded = repo.loadAll()[0];
    expect(loaded?.id).toBe(entry.id);
    expect(loaded?.type).toBe(entry.type);
    expect(loaded?.fromValue).toBe(entry.fromValue);
    expect(loaded?.fromUnit).toBe(entry.fromUnit);
    expect(loaded?.toValue).toBe(entry.toValue);
    expect(loaded?.toUnit).toBe(entry.toUnit);
    expect(loaded?.timestamp.getTime()).toBe(entry.timestamp.getTime());
  });
});
