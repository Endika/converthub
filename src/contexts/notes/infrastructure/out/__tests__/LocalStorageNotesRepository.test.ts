import { beforeEach, describe, expect, it } from 'vitest';
import { TravelNote } from '../../../domain/model/TravelNote';
import { LocalStorageNotesRepository } from '../LocalStorageNotesRepository';

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

describe('LocalStorageNotesRepository', () => {
  let storage: Storage;
  let repo: LocalStorageNotesRepository;

  beforeEach(() => {
    storage = buildMemoryStorage();
    repo = new LocalStorageNotesRepository(storage);
  });

  it('returns an empty list when storage is empty', () => {
    expect(repo.loadAll()).toEqual([]);
  });

  it('round-trips notes including both null and string location', () => {
    const anonymous = TravelNote.create({ text: 'coffee', location: null });
    const located = TravelNote.create({ text: 'metro', location: 'Madrid' });
    repo.saveAll([anonymous, located]);
    const loaded = repo.loadAll();
    expect(loaded).toHaveLength(2);
    expect(loaded[0]?.location).toBeNull();
    expect(loaded[1]?.location).toBe('Madrid');
  });

  it('returns [] for any malformed or unexpected stored shape', () => {
    storage.setItem('converthub:notes', 'not-json');
    expect(repo.loadAll()).toEqual([]);
    storage.setItem('converthub:notes', JSON.stringify({ foo: 'bar' }));
    expect(repo.loadAll()).toEqual([]);
    storage.setItem('converthub:notes', JSON.stringify([{ id: '1' }, null]));
    expect(repo.loadAll()).toEqual([]);
  });
});
