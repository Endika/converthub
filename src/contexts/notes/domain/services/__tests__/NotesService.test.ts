import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { NoteNotFoundError } from '../../errors/NoteNotFoundError';
import { NotesFullError } from '../../errors/NotesFullError';
import { TravelNote } from '../../model/TravelNote';
import type { NotesRepositoryPort } from '../../ports/out/NotesRepositoryPort';
import { NotesService } from '../NotesService';

const buildRepo = (initial: TravelNote[] = []): NotesRepositoryPort => {
  let state = initial;
  return {
    loadAll: () => [...state],
    saveAll: (notes) => {
      state = [...notes];
    },
  };
};

const note = (id: string, text: string): TravelNote =>
  new TravelNote(id, { text, location: null, createdAt: new Date() });

describe('NotesService', () => {
  it('adds a note at the head', () => {
    const service = new NotesService(buildRepo());
    const r = service.add(note('a', 'hello'));
    expect(isOk(r)).toBe(true);
    expect(service.list()).toHaveLength(1);
  });

  it('returns NotesFullError when the cap is reached', () => {
    const initial = Array.from({ length: 2 }, (_, i) => note(String(i), 'x'));
    const service = new NotesService(buildRepo(initial), 2);
    const r = service.add(note('new', 'y'));
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(NotesFullError);
  });

  it('updates the text of an existing note', () => {
    const service = new NotesService(buildRepo([note('a', 'old')]));
    const r = service.update('a', 'new');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.text).toBe('new');
    expect(service.list()[0]?.text).toBe('new');
  });

  it('preserves siblings when updating one note among several', () => {
    const service = new NotesService(
      buildRepo([note('a', 'A'), note('b', 'B'), note('c', 'C')]),
    );
    service.update('b', 'B-new');
    const list = service.list();
    expect(list.map((n) => n.text)).toEqual(['A', 'B-new', 'C']);
  });

  it('returns NoteNotFoundError when updating a missing note', () => {
    const service = new NotesService(buildRepo());
    const r = service.update('missing', 'x');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(NoteNotFoundError);
  });

  it('removes a note by id', () => {
    const service = new NotesService(
      buildRepo([note('a', 'x'), note('b', 'y')]),
    );
    service.remove('a');
    expect(service.list().map((n) => n.id)).toEqual(['b']);
  });
});
