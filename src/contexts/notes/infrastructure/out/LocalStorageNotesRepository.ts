import { TravelNote } from '../../domain/model/TravelNote';
import type { NotesRepositoryPort } from '../../domain/ports/out/NotesRepositoryPort';

const STORAGE_KEY = 'converthub:notes';

interface PersistedNote {
  id: string;
  text: string;
  location: string | null;
  createdAt: number;
}

const isPersistedNote = (data: unknown): data is PersistedNote => {
  if (typeof data !== 'object' || data === null) return false;
  const n = data as Partial<PersistedNote>;
  return (
    typeof n.id === 'string' &&
    typeof n.text === 'string' &&
    (n.location === null || typeof n.location === 'string') &&
    typeof n.createdAt === 'number'
  );
};

const toEntity = (p: PersistedNote): TravelNote =>
  new TravelNote(p.id, {
    text: p.text,
    location: p.location,
    createdAt: new Date(p.createdAt),
  });

const toPersisted = (n: TravelNote): PersistedNote => ({
  id: n.id,
  text: n.text,
  location: n.location,
  createdAt: n.createdAt.getTime(),
});

export class LocalStorageNotesRepository implements NotesRepositoryPort {
  constructor(private readonly storage: Storage = localStorage) {}

  loadAll(): TravelNote[] {
    const raw = this.storage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isPersistedNote).map(toEntity);
    } catch {
      return [];
    }
  }

  saveAll(notes: readonly TravelNote[]): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(notes.map(toPersisted)));
  }
}
