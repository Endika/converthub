import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { RateNotAvailableError } from '../../errors/RateNotAvailableError';
import type { CurrencyCode } from '../../model/CurrencyCode';

export interface ExchangeRateProviderPort {
  getRate(currency: CurrencyCode): Result<number, RateNotAvailableError>;
}
