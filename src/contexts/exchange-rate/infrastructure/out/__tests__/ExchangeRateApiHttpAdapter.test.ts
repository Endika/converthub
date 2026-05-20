import { describe, expect, it, vi } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { ExchangeRateFetchError } from '../../../domain/errors/ExchangeRateFetchError';
import { ExchangeRateApiHttpAdapter } from '../ExchangeRateApiHttpAdapter';

const buildResponse = (body: unknown, ok = true, status = 200): Response =>
  ({
    ok,
    status,
    json: vi.fn(async () => body),
  }) as unknown as Response;

describe('ExchangeRateApiHttpAdapter', () => {
  it('returns parsed rates on a successful response', async () => {
    const fetchFn = vi.fn(async () =>
      buildResponse({ base: 'USD', rates: { EUR: 0.92, GBP: 0.79 } }),
    );
    const adapter = new ExchangeRateApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');
    expect(isOk(result)).toBe(true);
    if (isOk(result)) expect(result.value).toEqual({ EUR: 0.92, GBP: 0.79 });
    expect(fetchFn).toHaveBeenCalledWith(expect.stringContaining('/USD'));
  });

  it('returns a fetch error on non-2xx responses', async () => {
    const fetchFn = vi.fn(async () => buildResponse(null, false, 503));
    const adapter = new ExchangeRateApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(ExchangeRateFetchError);
      expect(result.error.reason).toContain('503');
    }
  });

  it('returns a fetch error on invalid response shape', async () => {
    const fetchFn = vi.fn(async () => buildResponse({ foo: 'bar' }));
    const adapter = new ExchangeRateApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.reason).toContain('Invalid');
  });

  it('rejects responses with non-numeric rates', async () => {
    const fetchFn = vi.fn(async () =>
      buildResponse({ rates: { EUR: 'oops' } }),
    );
    const adapter = new ExchangeRateApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');
    expect(isErr(result)).toBe(true);
  });

  it('captures thrown network errors', async () => {
    const fetchFn = vi.fn(async () => {
      throw new Error('network down');
    });
    const adapter = new ExchangeRateApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.reason).toBe('network down');
  });

  it('rejects null response body', async () => {
    const fetchFn = vi.fn(async () => buildResponse(null));
    const adapter = new ExchangeRateApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');
    expect(isErr(result)).toBe(true);
  });

  it('handles non-Error thrown values', async () => {
    const fetchFn = vi.fn(async () => {
      throw 'string error';
    });
    const adapter = new ExchangeRateApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.reason).toBe('Unknown error');
  });
});
