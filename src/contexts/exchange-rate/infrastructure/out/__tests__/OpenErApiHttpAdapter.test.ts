import { describe, expect, it, vi } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { ExchangeRateFetchError } from '../../../domain/errors/ExchangeRateFetchError';
import { OpenErApiHttpAdapter } from '../OpenErApiHttpAdapter';

const buildResponse = (body: unknown, ok = true, status = 200): Response =>
  ({
    ok,
    status,
    json: vi.fn(async () => body),
  }) as unknown as Response;

describe('OpenErApiHttpAdapter', () => {
  it('parses the rates field from the v6 free endpoint', async () => {
    const fetchFn = vi.fn(async () =>
      buildResponse({
        result: 'success',
        base_code: 'USD',
        rates: { USD: 1, EUR: 0.92, ALL: 82.09 },
      }),
    );
    const adapter = new OpenErApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');

    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value['EUR']).toBe(0.92);
      expect(result.value['ALL']).toBe(82.09);
    }
    expect(fetchFn).toHaveBeenCalledWith(expect.stringContaining('/USD'));
  });

  it('returns a fetch error on non-2xx responses', async () => {
    const fetchFn = vi.fn(async () => buildResponse(null, false, 429));
    const adapter = new OpenErApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(ExchangeRateFetchError);
      expect(result.error.reason).toContain('429');
    }
  });

  it('returns a fetch error on invalid response shape', async () => {
    const fetchFn = vi.fn(async () =>
      buildResponse({ result: 'success', no_rates_here: true }),
    );
    const adapter = new OpenErApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.reason).toContain('Invalid');
  });

  it('captures thrown network errors', async () => {
    const fetchFn = vi.fn(async () => {
      throw new Error('network down');
    });
    const adapter = new OpenErApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.reason).toBe('network down');
  });
});
