import { describe, expect, it, vi } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { ExchangeRateFetchError } from '../../../domain/errors/ExchangeRateFetchError';
import { FrankfurterApiHttpAdapter } from '../FrankfurterApiHttpAdapter';

const buildResponse = (body: unknown, ok = true, status = 200): Response =>
  ({
    ok,
    status,
    json: vi.fn(async () => body),
  }) as unknown as Response;

describe('FrankfurterApiHttpAdapter', () => {
  it('queries the endpoint with the base currency as the "from" query param', async () => {
    const fetchFn = vi.fn(async () =>
      buildResponse({
        amount: 1,
        base: 'USD',
        date: '2026-05-22',
        rates: { EUR: 0.92, GBP: 0.79 },
      }),
    );
    const adapter = new FrankfurterApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');

    expect(isOk(result)).toBe(true);
    expect(fetchFn).toHaveBeenCalledWith(expect.stringContaining('?from=USD'));
  });

  it('includes the base currency itself with rate 1, since frankfurter omits it', async () => {
    const fetchFn = vi.fn(async () =>
      buildResponse({ rates: { EUR: 0.92, GBP: 0.79 } }),
    );
    const adapter = new FrankfurterApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');

    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value['USD']).toBe(1);
      expect(result.value['EUR']).toBe(0.92);
    }
  });

  it('returns a fetch error on non-2xx responses', async () => {
    const fetchFn = vi.fn(async () => buildResponse(null, false, 422));
    const adapter = new FrankfurterApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('AED');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(ExchangeRateFetchError);
      expect(result.error.reason).toContain('422');
    }
  });

  it('returns a fetch error on invalid response shape', async () => {
    const fetchFn = vi.fn(async () => buildResponse({ foo: 'bar' }));
    const adapter = new FrankfurterApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.reason).toContain('Invalid');
  });

  it('captures thrown network errors', async () => {
    const fetchFn = vi.fn(async () => {
      throw new Error('offline');
    });
    const adapter = new FrankfurterApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.reason).toBe('offline');
  });
});
