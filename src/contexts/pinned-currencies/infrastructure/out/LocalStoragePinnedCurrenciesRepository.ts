import { PinnedCurrency } from '../../domain/model/PinnedCurrency';
import type { PinnedCurrenciesRepositoryPort } from '../../domain/ports/out/PinnedCurrenciesRepositoryPort';

const STORAGE_KEY = 'converthub:pinned-currencies';

interface PersistedItem {
  code: string;
  pinnedAt: number;
}

const isPersistedItem = (data: unknown): data is PersistedItem => {
  if (typeof data !== 'object' || data === null) return false;
  const i = data as Partial<PersistedItem>;
  return typeof i.code === 'string' && typeof i.pinnedAt === 'number';
};

export class LocalStoragePinnedCurrenciesRepository implements PinnedCurrenciesRepositoryPort {
  constructor(private readonly storage: Storage = localStorage) {}

  loadAll(): PinnedCurrency[] {
    const raw = this.storage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed
        .filter(isPersistedItem)
        .map((p) => new PinnedCurrency(p.code, new Date(p.pinnedAt)));
    } catch {
      return [];
    }
  }

  saveAll(items: readonly PinnedCurrency[]): void {
    const shape: PersistedItem[] = items.map((p) => ({
      code: p.code,
      pinnedAt: p.pinnedAt.getTime(),
    }));
    this.storage.setItem(STORAGE_KEY, JSON.stringify(shape));
  }
}
