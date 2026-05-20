import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../shared-kernel/domain/Result';
import { NoteNotFoundError } from '../../domain/errors/NoteNotFoundError';
import { NotesFullError } from '../../domain/errors/NotesFullError';
import { TravelNote } from '../../domain/model/TravelNote';
import type { NotesRepositoryPort } from '../../domain/ports/out/NotesRepositoryPort';
import { NotesService } from '../../domain/services/NotesService';
import { AddNoteUseCase } from '../AddNoteUseCase';
import { DeleteNoteUseCase } from '../DeleteNoteUseCase';
import { GetNotesUseCase } from '../GetNotesUseCase';
import { UpdateNoteUseCase } from '../UpdateNoteUseCase';

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

describe('Notes use cases', () => {
  it('AddNoteUseCase persists a note', () => {
    const service = new NotesService(buildRepo());
    const r = new AddNoteUseCase(service).execute(note('a', 'x'));
    expect(isOk(r)).toBe(true);
  });

  it('AddNoteUseCase surfaces NotesFullError', () => {
    const service = new NotesService(buildRepo([note('a', 'x')]), 1);
    const r = new AddNoteUseCase(service).execute(note('b', 'y'));
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(NotesFullError);
  });

  it('UpdateNoteUseCase updates the text', () => {
    const service = new NotesService(buildRepo([note('a', 'old')]));
    const r = new UpdateNoteUseCase(service).execute('a', 'new');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.text).toBe('new');
  });

  it('UpdateNoteUseCase fails for missing id', () => {
    const service = new NotesService(buildRepo());
    const r = new UpdateNoteUseCase(service).execute('x', 'y');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(NoteNotFoundError);
  });

  it('DeleteNoteUseCase removes a note', () => {
    const service = new NotesService(buildRepo([note('a', 'x')]));
    new DeleteNoteUseCase(service).execute('a');
    expect(service.list()).toHaveLength(0);
  });

  it('GetNotesUseCase lists notes', () => {
    const service = new NotesService(buildRepo([note('a', 'x'), note('b', 'y')]));
    expect(new GetNotesUseCase(service).execute()).toHaveLength(2);
  });
});
