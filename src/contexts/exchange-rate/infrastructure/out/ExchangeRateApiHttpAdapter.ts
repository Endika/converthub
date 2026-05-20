import {
  err,
  ok,
  type Result,
} from '../../../../shared-kernel/domain/Result';
import { ExchangeRateFetchError } from '../../domain/errors/ExchangeRateFetchError';
import type { ExchangeRateApiPort } from '../../domain/ports/out/ExchangeRateApiPort';

const DEFAULT_ENDPOINT = 'https://api.exchangerate-api.com/v4/latest';

const parseRates = (raw: unknown): Record<string, number> | null => {
  if (typeof raw !== 'object' || raw === null) return null;
  const candidate = (raw as { rates?: unknown }).rates;
  if (typeof candidate !== 'object' || candidate === null) return null;
  const result: Record<string, number> = {};
  for (const [code, value] of Object.entries(candidate)) {
    if (typeof value !== 'number' || !Number.isFinite(value)) return null;
    result[code] = value;
  }
  return result;
};

export class ExchangeRateApiHttpAdapter implements ExchangeRateApiPort {
  constructor(
    private readonly fetchFn: typeof fetch = fetch.bind(globalThis),
    private readonly endpoint: string = DEFAULT_ENDPOINT,
  ) {}

  async fetchLatest(
    baseCurrency: string,
  ): Promise<Result<Record<string, number>, ExchangeRateFetchError>> {
    try {
      const response = await this.fetchFn(`${this.endpoint}/${baseCurrency}`);
      if (!response.ok) {
        return err(new ExchangeRateFetchError(`HTTP ${response.status}`));
      }
      const json: unknown = await response.json();
      const rates = parseRates(json);
      if (rates === null) {
        return err(new ExchangeRateFetchError('Invalid response shape'));
      }
      return ok(rates);
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'Unknown error';
      return err(new ExchangeRateFetchError(reason));
    }
  }
}
