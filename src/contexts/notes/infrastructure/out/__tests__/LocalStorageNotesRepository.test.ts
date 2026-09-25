import { beforeEach, describe, expect, it } from 'vitest';
import { isErr } from '../../../../../shared-kernel/domain/Result';
import { StorageWriteError } from '../../../../../shared-kernel/domain/StorageWriteError';
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

  it('returns [] instead of crashing when getItem throws', () => {
    storage.getItem = () => {
      throw new Error('storage unavailable');
    };
    expect(repo.loadAll()).toEqual([]);
  });

  it('never calls setItem while loading', () => {
    storage.setItem('converthub:notes', JSON.stringify([{ id: '1' }]));
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
    const original = TravelNote.create({ text: 'kept', location: null });
    repo.saveAll([original]);
    storage.setItem = () => {
      throw new Error('quota exceeded');
    };
    const result = repo.saveAll([
      TravelNote.create({ text: 'lost', location: null }),
    ]);
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error).toBeInstanceOf(StorageWriteError);
    expect(repo.loadAll()[0]?.text).toBe('kept');
  });

  it('format guard: a literal snapshot of the current on-disk format loads back complete', () => {
    const snapshot = JSON.stringify([
      {
        id: 'n-1',
        text: 'coffee at Café de Flore',
        location: 'Paris',
        createdAt: 1700000000000,
      },
      {
        id: 'n-2',
        text: 'no location taken',
        location: null,
        createdAt: 1700000100000,
      },
    ]);
    storage.setItem('converthub:notes', snapshot);
    const loaded = repo.loadAll();
    expect(loaded).toHaveLength(2);
    expect(loaded[0]?.id).toBe('n-1');
    expect(loaded[0]?.text).toBe('coffee at Café de Flore');
    expect(loaded[0]?.location).toBe('Paris');
    expect(loaded[0]?.createdAt.getTime()).toBe(1700000000000);
    expect(loaded[1]?.id).toBe('n-2');
    expect(loaded[1]?.location).toBeNull();
    expect(loaded[1]?.createdAt.getTime()).toBe(1700000100000);
  });

  it('format guard: a note saved through the real save path loads back with every field intact', () => {
    const note = TravelNote.create({
      text: 'metro ticket',
      location: 'Madrid',
    });
    repo.saveAll([note]);
    const loaded = repo.loadAll()[0];
    expect(loaded?.id).toBe(note.id);
    expect(loaded?.text).toBe(note.text);
    expect(loaded?.location).toBe(note.location);
    expect(loaded?.createdAt.getTime()).toBe(note.createdAt.getTime());
  });
});
