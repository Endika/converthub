import { beforeEach, describe, expect, it } from 'vitest';
import { LocalStorageLanguageRepository } from '../LocalStorageLanguageRepository';

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

describe('LocalStorageLanguageRepository', () => {
  let storage: Storage;
  let repo: LocalStorageLanguageRepository;

  beforeEach(() => {
    storage = buildMemoryStorage();
    repo = new LocalStorageLanguageRepository(storage);
  });

  it('returns null when nothing is stored', () => {
    expect(repo.load()).toBeNull();
  });

  it('round-trips a supported language', () => {
    repo.save('eu');
    expect(repo.load()).toBe('eu');
  });

  it('returns null when stored value is not a supported language', () => {
    storage.setItem('converthub:language', 'fr');
    expect(repo.load()).toBeNull();
  });
});
