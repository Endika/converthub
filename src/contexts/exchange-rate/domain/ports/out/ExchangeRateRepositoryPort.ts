import type { ExchangeRateSnapshot } from '../../model/ExchangeRateSnapshot';

export interface ExchangeRateRepositoryPort {
  load(): ExchangeRateSnapshot | null;
  save(snapshot: ExchangeRateSnapshot): void;
}
