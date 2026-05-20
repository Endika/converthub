import type { Result } from '../../../shared-kernel/domain/Result';
import type { RateNotFoundError } from '../domain/errors/RateNotFoundError';
import type { GetExchangeRatePort } from '../domain/ports/in/GetExchangeRatePort';
import type { ExchangeRateService } from '../domain/services/ExchangeRateService';

export class GetExchangeRateUseCase implements GetExchangeRatePort {
  constructor(private readonly service: ExchangeRateService) {}

  execute(currency: string): Result<number, RateNotFoundError> {
    return this.service.getRate(currency);
  }
}
