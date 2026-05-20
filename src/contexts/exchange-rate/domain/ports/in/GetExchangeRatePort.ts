import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { RateNotFoundError } from '../../errors/RateNotFoundError';

export interface GetExchangeRatePort {
  execute(currency: string): Result<number, RateNotFoundError>;
}
