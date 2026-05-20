import { err, ok, type Result } from '../../../../shared-kernel/domain/Result';
import { NoteNotFoundError } from '../errors/NoteNotFoundError';
import { NotesFullError } from '../errors/NotesFullError';
import type { TravelNote } from '../model/TravelNote';
import type { NotesRepositoryPort } from '../ports/out/NotesRepositoryPort';

export const MAX_NOTES = 50;

export class NotesService {
  constructor(
    private readonly repository: NotesRepositoryPort,
    private readonly maxItems: number = MAX_NOTES,
  ) {}

  add(note: TravelNote): Result<void, NotesFullError> {
    const current = this.repository.loadAll();
    if (current.length >= this.maxItems) {
      return err(new NotesFullError(this.maxItems));
    }
    this.repository.saveAll([note, ...current]);
    return ok(undefined);
  }

  update(id: string, text: string): Result<TravelNote, NoteNotFoundError> {
    const current = this.repository.loadAll();
    const existing = current.find((n) => n.id === id);
    if (existing === undefined) return err(new NoteNotFoundError(id));
    const updated = existing.withText(text);
    this.repository.saveAll(current.map((n) => (n.id === id ? updated : n)));
    return ok(updated);
  }

  remove(id: string): void {
    const current = this.repository.loadAll();
    this.repository.saveAll(current.filter((n) => n.id !== id));
  }

  list(): readonly TravelNote[] {
    return this.repository.loadAll();
  }
}
