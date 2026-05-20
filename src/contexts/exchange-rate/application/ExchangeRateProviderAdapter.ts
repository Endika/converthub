import {
  err,
  isErr,
  ok,
  type Result,
} from '../../../shared-kernel/domain/Result';
import { RateNotAvailableError } from '../../conversion/domain/errors/RateNotAvailableError';
import type { CurrencyCode } from '../../conversion/domain/model/CurrencyCode';
import type { ExchangeRateProviderPort } from '../../conversion/domain/ports/out/ExchangeRateProviderPort';
import type { GetExchangeRatePort } from '../domain/ports/in/GetExchangeRatePort';

export class ExchangeRateProviderAdapter implements ExchangeRateProviderPort {
  constructor(private readonly getRatePort: GetExchangeRatePort) {}

  getRate(currency: CurrencyCode): Result<number, RateNotAvailableError> {
    const result = this.getRatePort.execute(currency.value);
    if (isErr(result)) return err(new RateNotAvailableError(currency.value));
    return ok(result.value);
  }
}
