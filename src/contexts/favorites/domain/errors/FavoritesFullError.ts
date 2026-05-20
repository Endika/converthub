export class FavoritesFullError extends Error {
  readonly max: number;

  constructor(max: number) {
    super(`Cannot add more than ${max} favorites`);
    this.name = 'FavoritesFullError';
    this.max = max;
  }
}
