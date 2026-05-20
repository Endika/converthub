import type { ConversionEntry } from '../../model/ConversionEntry';

export interface HistoryRepositoryPort {
  loadAll(): ConversionEntry[];
  saveAll(entries: readonly ConversionEntry[]): void;
}
