import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { ExchangeRateFetchError } from '../../errors/ExchangeRateFetchError';
import type { ExchangeRateSnapshot } from '../../model/ExchangeRateSnapshot';

export interface UpdateExchangeRatesPort {
  execute(): Promise<Result<ExchangeRateSnapshot, ExchangeRateFetchError>>;
}
