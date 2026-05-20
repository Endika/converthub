import {
  isErr,
  ok,
  type Result,
} from '../../../shared-kernel/domain/Result';
import type { LoggerPort } from '../../../shared-kernel/ports/LoggerPort';
import type { ExchangeRateFetchError } from '../domain/errors/ExchangeRateFetchError';
import { ExchangeRateSnapshot } from '../domain/model/ExchangeRateSnapshot';
import type { UpdateExchangeRatesPort } from '../domain/ports/in/UpdateExchangeRatesPort';
import type { ExchangeRateApiPort } from '../domain/ports/out/ExchangeRateApiPort';
import type { ExchangeRateRepositoryPort } from '../domain/ports/out/ExchangeRateRepositoryPort';

const DEFAULT_BASE = 'USD';

export class UpdateExchangeRatesUseCase implements UpdateExchangeRatesPort {
  constructor(
    private readonly api: ExchangeRateApiPort,
    private readonly repository: ExchangeRateRepositoryPort,
    private readonly logger: LoggerPort,
    private readonly base: string = DEFAULT_BASE,
  ) {}

  async execute(): Promise<Result<ExchangeRateSnapshot, ExchangeRateFetchError>> {
    this.logger.info('Updating exchange rates', { base: this.base });
    const result = await this.api.fetchLatest(this.base);
    if (isErr(result)) {
      this.logger.error('Failed to update rates', { reason: result.error.reason });
      return result;
    }
    const snapshot = new ExchangeRateSnapshot(this.base, result.value, new Date());
    this.repository.save(snapshot);
    return ok(snapshot);
  }
}
