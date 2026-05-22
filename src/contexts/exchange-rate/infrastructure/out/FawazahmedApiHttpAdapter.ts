import { err, ok, type Result } from '../../../../shared-kernel/domain/Result';
import { ExchangeRateFetchError } from '../../domain/errors/ExchangeRateFetchError';
import type { ExchangeRateApiPort } from '../../domain/ports/out/ExchangeRateApiPort';

const DEFAULT_ENDPOINT =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';

const parseRates = (
  raw: unknown,
  baseCurrency: string,
): Record<string, number> | null => {
  if (typeof raw !== 'object' || raw === null) return null;
  const baseKey = baseCurrency.toLowerCase();
  const candidate = (raw as Record<string, unknown>)[baseKey];
  if (typeof candidate !== 'object' || candidate === null) return null;
  const result: Record<string, number> = {};
  for (const [code, value] of Object.entries(candidate)) {
    if (typeof value !== 'number' || !Number.isFinite(value)) continue;
    result[code.toUpperCase()] = value;
  }
  return result;
};

export class FawazahmedApiHttpAdapter implements ExchangeRateApiPort {
  constructor(
    private readonly fetchFn: typeof fetch = fetch.bind(globalThis),
    private readonly endpoint: string = DEFAULT_ENDPOINT,
  ) {}

  async fetchLatest(
    baseCurrency: string,
  ): Promise<Result<Record<string, number>, ExchangeRateFetchError>> {
    try {
      const response = await this.fetchFn(
        `${this.endpoint}/${baseCurrency.toLowerCase()}.json`,
      );
      if (!response.ok) {
        return err(new ExchangeRateFetchError(`HTTP ${response.status}`));
      }
      const json: unknown = await response.json();
      const rates = parseRates(json, baseCurrency);
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
