import { describe, expect, it } from 'vitest';
import { LanguageCode } from '../../../../../contexts/language/domain/model/LanguageCode';
import { LanguageService } from '../../../../../contexts/language/domain/services/LanguageService';
import { AddNoteUseCase } from '../../../../../contexts/notes/application/AddNoteUseCase';
import { DeleteNoteUseCase } from '../../../../../contexts/notes/application/DeleteNoteUseCase';
import { GetNotesUseCase } from '../../../../../contexts/notes/application/GetNotesUseCase';
import { UpdateNoteUseCase } from '../../../../../contexts/notes/application/UpdateNoteUseCase';
import { TravelNote } from '../../../../../contexts/notes/domain/model/TravelNote';
import type { NotesRepositoryPort } from '../../../../../contexts/notes/domain/ports/out/NotesRepositoryPort';
import { NotesService } from '../../../../../contexts/notes/domain/services/NotesService';
import { NotesList } from '../NotesList';

const buildRepo = (initial: TravelNote[] = []): NotesRepositoryPort => {
  let state = [...initial];
  return {
    loadAll: () => [...state],
    saveAll: (items) => {
      state = [...items];
    },
  };
};

const mount = (
  initial: TravelNote[] = [],
  maxItems = 50,
): { root: HTMLElement; repo: NotesRepositoryPort } => {
  const root = document.createElement('div');
  const language = new LanguageService(LanguageCode.fromTrusted('en'));
  const repo = buildRepo(initial);
  const service = new NotesService(repo, maxItems);
  new NotesList(
    root,
    language,
    new GetNotesUseCase(service),
    new AddNoteUseCase(service),
    new UpdateNoteUseCase(service),
    new DeleteNoteUseCase(service),
  );
  return { root, repo };
};

const submitForm = (
  form: HTMLFormElement,
  text: string,
  location = '',
): void => {
  (form.elements.namedItem('text') as HTMLInputElement).value = text;
  const locInput = form.elements.namedItem('location');
  if (locInput !== null) (locInput as HTMLInputElement).value = location;
  form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
};

describe('NotesList', () => {
  it('shows an empty message when there are no notes', () => {
    const { root } = mount();
    expect(root.textContent?.toLowerCase()).toContain('no notes');
  });

  it('adds a note when the add form is submitted', () => {
    const { root, repo } = mount();
    const form = root.querySelector<HTMLFormElement>('form[data-action="add"]');
    if (form === null) throw new Error('add form missing');
    submitForm(form, 'café en París', 'Paris');
    expect(repo.loadAll()).toHaveLength(1);
    expect(repo.loadAll()[0]?.text).toBe('café en París');
    expect(repo.loadAll()[0]?.location).toBe('Paris');
    expect(root.querySelectorAll('[data-id]')).toHaveLength(1);
  });

  it('persists a null location when the location input is empty', () => {
    const { root, repo } = mount();
    const form = root.querySelector<HTMLFormElement>('form[data-action="add"]');
    if (form === null) throw new Error('add form missing');
    submitForm(form, 'note without place');
    expect(repo.loadAll()[0]?.location).toBeNull();
  });

  it('ignores submissions with empty text', () => {
    const { root, repo } = mount();
    const form = root.querySelector<HTMLFormElement>('form[data-action="add"]');
    if (form === null) throw new Error('add form missing');
    submitForm(form, '   ');
    expect(repo.loadAll()).toHaveLength(0);
  });

  it('shows the cap error when the list is full', () => {
    const initial = [TravelNote.create({ text: 'one', location: null })];
    const { root } = mount(initial, 1);
    const form = root.querySelector<HTMLFormElement>('form[data-action="add"]');
    if (form === null) throw new Error('add form missing');
    submitForm(form, 'two');
    expect(
      root.querySelector('[data-region="error"]')?.textContent?.toLowerCase(),
    ).toContain('limit');
  });

  it('deletes a note via the remove action', () => {
    const note = TravelNote.create({ text: 'to delete', location: null });
    const { root, repo } = mount([note]);
    root.querySelector<HTMLButtonElement>('[data-action="remove"]')?.click();
    expect(repo.loadAll()).toHaveLength(0);
  });

  it('edits a note via the inline form', () => {
    const note = TravelNote.create({ text: 'old', location: null });
    const { root, repo } = mount([note]);
    root.querySelector<HTMLButtonElement>('[data-action="edit"]')?.click();
    const editForm = root.querySelector<HTMLFormElement>(
      'form[data-action="update"]',
    );
    if (editForm === null) throw new Error('edit form missing');
    (editForm.elements.namedItem('text') as HTMLInputElement).value = 'new';
    editForm.dispatchEvent(
      new Event('submit', { cancelable: true, bubbles: true }),
    );
    expect(repo.loadAll()[0]?.text).toBe('new');
  });

  it('cancels editing without modifying the note', () => {
    const note = TravelNote.create({ text: 'old', location: null });
    const { root, repo } = mount([note]);
    root.querySelector<HTMLButtonElement>('[data-action="edit"]')?.click();
    root.querySelector<HTMLButtonElement>('[data-action="cancel"]')?.click();
    expect(repo.loadAll()[0]?.text).toBe('old');
    expect(root.querySelector('form[data-action="update"]')).toBeNull();
  });
});
