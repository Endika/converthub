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

  it('round-trips notes including null location', () => {
    const n = TravelNote.create({ text: 'coffee', location: null });
    repo.saveAll([n]);
    const loaded = repo.loadAll();
    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.location).toBeNull();
  });

  it('round-trips notes with a string location', () => {
    const n = TravelNote.create({ text: 'metro', location: 'Madrid' });
    repo.saveAll([n]);
    expect(repo.loadAll()[0]?.location).toBe('Madrid');
  });

  it('returns [] for malformed JSON', () => {
    storage.setItem('converthub:notes', 'not-json');
    expect(repo.loadAll()).toEqual([]);
  });

  it('drops items with invalid shape', () => {
    storage.setItem(
      'converthub:notes',
      JSON.stringify([{ id: '1', bogus: true }]),
    );
    expect(repo.loadAll()).toEqual([]);
  });

  it('returns [] when stored JSON is not an array', () => {
    storage.setItem('converthub:notes', JSON.stringify({ foo: 'bar' }));
    expect(repo.loadAll()).toEqual([]);
  });

  it('drops null entries inside the array', () => {
    storage.setItem('converthub:notes', JSON.stringify([null]));
    expect(repo.loadAll()).toEqual([]);
  });

  it('defaults to global localStorage when no storage injected', () => {
    const r = new LocalStorageNotesRepository();
    r.saveAll([]);
    expect(r.loadAll()).toEqual([]);
    localStorage.removeItem('converthub:notes');
  });
});
