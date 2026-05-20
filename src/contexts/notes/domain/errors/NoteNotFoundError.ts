export class NoteNotFoundError extends Error {
  readonly id: string;

  constructor(id: string) {
    super(`Note not found: ${id}`);
    this.name = 'NoteNotFoundError';
    this.id = id;
  }
}
