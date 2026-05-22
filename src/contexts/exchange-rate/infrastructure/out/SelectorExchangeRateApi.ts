import type { Result } from '../../../../shared-kernel/domain/Result';
import type { ExchangeRateFetchError } from '../../domain/errors/ExchangeRateFetchError';
import type { RateProvider } from '../../domain/model/RateProvider';
import type { ExchangeRateApiPort } from '../../domain/ports/out/ExchangeRateApiPort';
import type { RateProviderPreferencePort } from '../../domain/ports/out/RateProviderPreferencePort';

export class SelectorExchangeRateApi implements ExchangeRateApiPort {
  constructor(
    private readonly adapters: Record<RateProvider, ExchangeRateApiPort>,
    private readonly preference: RateProviderPreferencePort,
  ) {}

  fetchLatest(
    baseCurrency: string,
  ): Promise<Result<Record<string, number>, ExchangeRateFetchError>> {
    return this.adapters[this.preference.get()].fetchLatest(baseCurrency);
  }
}
