import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { ExchangeRateFetchError } from '../../errors/ExchangeRateFetchError';

export interface ExchangeRateApiPort {
  fetchLatest(
    baseCurrency: string,
  ): Promise<Result<Record<string, number>, ExchangeRateFetchError>>;
}
