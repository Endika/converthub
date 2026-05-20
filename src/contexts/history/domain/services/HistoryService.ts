import type { ConversionEntry } from '../model/ConversionEntry';
import type { HistoryRepositoryPort } from '../ports/out/HistoryRepositoryPort';

export const MAX_HISTORY = 20;

export class HistoryService {
  constructor(
    private readonly repository: HistoryRepositoryPort,
    private readonly maxItems: number = MAX_HISTORY,
  ) {}

  add(entry: ConversionEntry): void {
    const current = this.repository.loadAll();
    const next = [entry, ...current].slice(0, this.maxItems);
    this.repository.saveAll(next);
  }

  list(): readonly ConversionEntry[] {
    return this.repository.loadAll();
  }

  clear(): void {
    this.repository.saveAll([]);
  }
}
