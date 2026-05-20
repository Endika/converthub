import { ExchangeRateSnapshot } from '../../domain/model/ExchangeRateSnapshot';
import type { ExchangeRateRepositoryPort } from '../../domain/ports/out/ExchangeRateRepositoryPort';

const STORAGE_KEY = 'converthub:rates';

interface PersistedShape {
  base: string;
  rates: Record<string, number>;
  fetchedAt: number;
}

const isValidShape = (data: unknown): data is PersistedShape => {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Partial<PersistedShape>;
  return (
    typeof obj.base === 'string' &&
    typeof obj.fetchedAt === 'number' &&
    typeof obj.rates === 'object' &&
    obj.rates !== null
  );
};

export class LocalStorageExchangeRateRepository
  implements ExchangeRateRepositoryPort
{
  constructor(private readonly storage: Storage = localStorage) {}

  load(): ExchangeRateSnapshot | null {
    const raw = this.storage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!isValidShape(parsed)) return null;
      return new ExchangeRateSnapshot(
        parsed.base,
        parsed.rates,
        new Date(parsed.fetchedAt),
      );
    } catch {
      return null;
    }
  }

  save(snapshot: ExchangeRateSnapshot): void {
    const shape: PersistedShape = {
      base: snapshot.baseCurrency,
      rates: { ...snapshot.rates },
      fetchedAt: snapshot.fetchedAt.getTime(),
    };
    this.storage.setItem(STORAGE_KEY, JSON.stringify(shape));
  }
}
