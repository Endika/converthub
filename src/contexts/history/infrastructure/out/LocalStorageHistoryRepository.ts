import {
  CONVERSION_TYPES,
  ConversionEntry,
  type ConversionType,
} from '../../domain/model/ConversionEntry';
import type { HistoryRepositoryPort } from '../../domain/ports/out/HistoryRepositoryPort';

const STORAGE_KEY = 'converthub:history';

interface PersistedEntry {
  id: string;
  type: string;
  fromValue: string;
  fromUnit: string;
  toValue: string;
  toUnit: string;
  timestamp: number;
}

const isConversionType = (raw: string): raw is ConversionType =>
  (CONVERSION_TYPES as readonly string[]).includes(raw);

const isPersistedEntry = (data: unknown): data is PersistedEntry => {
  if (typeof data !== 'object' || data === null) return false;
  const e = data as Partial<PersistedEntry>;
  return (
    typeof e.id === 'string' &&
    typeof e.type === 'string' &&
    isConversionType(e.type) &&
    typeof e.fromValue === 'string' &&
    typeof e.fromUnit === 'string' &&
    typeof e.toValue === 'string' &&
    typeof e.toUnit === 'string' &&
    typeof e.timestamp === 'number'
  );
};

const toEntity = (p: PersistedEntry): ConversionEntry =>
  new ConversionEntry(p.id, {
    type: p.type as ConversionType,
    fromValue: p.fromValue,
    fromUnit: p.fromUnit,
    toValue: p.toValue,
    toUnit: p.toUnit,
    timestamp: new Date(p.timestamp),
  });

const toPersisted = (e: ConversionEntry): PersistedEntry => ({
  id: e.id,
  type: e.type,
  fromValue: e.fromValue,
  fromUnit: e.fromUnit,
  toValue: e.toValue,
  toUnit: e.toUnit,
  timestamp: e.timestamp.getTime(),
});

export class LocalStorageHistoryRepository implements HistoryRepositoryPort {
  constructor(private readonly storage: Storage = localStorage) {}

  loadAll(): ConversionEntry[] {
    const raw = this.storage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isPersistedEntry).map(toEntity);
    } catch {
      return [];
    }
  }

  saveAll(entries: readonly ConversionEntry[]): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(entries.map(toPersisted)));
  }
}
