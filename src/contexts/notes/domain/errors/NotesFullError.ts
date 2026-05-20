export class NotesFullError extends Error {
  readonly max: number;

  constructor(max: number) {
    super(`Cannot add more than ${max} notes`);
    this.name = 'NotesFullError';
    this.max = max;
  }
}
