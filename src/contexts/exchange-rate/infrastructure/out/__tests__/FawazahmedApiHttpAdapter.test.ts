import { describe, expect, it, vi } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { ExchangeRateFetchError } from '../../../domain/errors/ExchangeRateFetchError';
import { FawazahmedApiHttpAdapter } from '../FawazahmedApiHttpAdapter';

const buildResponse = (body: unknown, ok = true, status = 200): Response =>
  ({
    ok,
    status,
    json: vi.fn(async () => body),
  }) as unknown as Response;

describe('FawazahmedApiHttpAdapter', () => {
  it('uppercases the rate codes and reads them under the lowercase base key', async () => {
    const fetchFn = vi.fn(async () =>
      buildResponse({
        date: '2026-05-22',
        usd: { eur: 0.92, all: 82.09, gbp: 0.79 },
      }),
    );
    const adapter = new FawazahmedApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');

    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value['EUR']).toBe(0.92);
      expect(result.value['ALL']).toBe(82.09);
      expect(result.value['GBP']).toBe(0.79);
    }
    expect(fetchFn).toHaveBeenCalledWith(expect.stringContaining('/usd.json'));
  });

  it('silently drops non-numeric entries (the API includes crypto/asset names)', async () => {
    const fetchFn = vi.fn(async () =>
      buildResponse({
        eur: {
          usd: 1.08,
          weird: 'not a number',
          btc: 0.0000234,
        },
      }),
    );
    const adapter = new FawazahmedApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('EUR');

    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value['USD']).toBe(1.08);
      expect(result.value['BTC']).toBe(0.0000234);
      expect(result.value['WEIRD']).toBeUndefined();
    }
  });

  it('returns a fetch error on non-2xx responses', async () => {
    const fetchFn = vi.fn(async () => buildResponse(null, false, 404));
    const adapter = new FawazahmedApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(ExchangeRateFetchError);
      expect(result.error.reason).toContain('404');
    }
  });

  it('returns a fetch error when the base key is missing from the payload', async () => {
    const fetchFn = vi.fn(async () =>
      buildResponse({ date: '2026-05-22', different_base: { eur: 1 } }),
    );
    const adapter = new FawazahmedApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.reason).toContain('Invalid');
  });

  it('captures thrown network errors', async () => {
    const fetchFn = vi.fn(async () => {
      throw new Error('cdn down');
    });
    const adapter = new FawazahmedApiHttpAdapter(fetchFn);
    const result = await adapter.fetchLatest('USD');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.reason).toBe('cdn down');
  });
});
