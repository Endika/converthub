import {
  FAVORITE_TYPES,
  Favorite,
  type FavoriteType,
} from '../../domain/model/Favorite';
import type { FavoritesRepositoryPort } from '../../domain/ports/out/FavoritesRepositoryPort';

const STORAGE_KEY = 'converthub:favorites';

interface PersistedFavorite {
  id: string;
  type: string;
  fromUnit: string;
  toUnit: string;
  label: string;
  amount?: number | null;
  createdAt: number;
}

const isFavoriteType = (raw: string): raw is FavoriteType =>
  (FAVORITE_TYPES as readonly string[]).includes(raw);

const isPersistedFavorite = (data: unknown): data is PersistedFavorite => {
  if (typeof data !== 'object' || data === null) return false;
  const f = data as Partial<PersistedFavorite>;
  return (
    typeof f.id === 'string' &&
    typeof f.type === 'string' &&
    isFavoriteType(f.type) &&
    typeof f.fromUnit === 'string' &&
    typeof f.toUnit === 'string' &&
    typeof f.label === 'string' &&
    typeof f.createdAt === 'number' &&
    (f.amount === undefined ||
      f.amount === null ||
      typeof f.amount === 'number')
  );
};

const toEntity = (p: PersistedFavorite): Favorite =>
  new Favorite(p.id, {
    type: p.type as FavoriteType,
    fromUnit: p.fromUnit,
    toUnit: p.toUnit,
    label: p.label,
    amount: p.amount ?? null,
    createdAt: new Date(p.createdAt),
  });

const toPersisted = (f: Favorite): PersistedFavorite => ({
  id: f.id,
  type: f.type,
  fromUnit: f.fromUnit,
  toUnit: f.toUnit,
  label: f.label,
  amount: f.amount,
  createdAt: f.createdAt.getTime(),
});

export class LocalStorageFavoritesRepository implements FavoritesRepositoryPort {
  constructor(private readonly storage: Storage = localStorage) {}

  loadAll(): Favorite[] {
    const raw = this.storage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isPersistedFavorite).map(toEntity);
    } catch {
      return [];
    }
  }

  saveAll(favorites: readonly Favorite[]): void {
    this.storage.setItem(
      STORAGE_KEY,
      JSON.stringify(favorites.map(toPersisted)),
    );
  }
}
