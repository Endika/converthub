import { describe, expect, it } from 'vitest';
import { ok, type Result } from '../../../../../shared-kernel/domain/Result';
import type { ExchangeRateFetchError } from '../../../domain/errors/ExchangeRateFetchError';
import type { RateProvider } from '../../../domain/model/RateProvider';
import type { ExchangeRateApiPort } from '../../../domain/ports/out/ExchangeRateApiPort';
import type { RateProviderPreferencePort } from '../../../domain/ports/out/RateProviderPreferencePort';
import { SelectorExchangeRateApi } from '../SelectorExchangeRateApi';

const stubAdapter = (
  marker: string,
): ExchangeRateApiPort & { calls: string[] } => {
  const calls: string[] = [];
  return {
    calls,
    async fetchLatest(
      base: string,
    ): Promise<Result<Record<string, number>, ExchangeRateFetchError>> {
      calls.push(base);
      return ok({ [base]: 1, [`${marker}-rate`]: 42 });
    },
  };
};

const fixedPreference = (
  provider: RateProvider,
): RateProviderPreferencePort => ({
  get: () => provider,
  set: () => {
    /* no-op */
  },
});

describe('SelectorExchangeRateApi', () => {
  it('routes the call to the adapter chosen by the preference', async () => {
    const a = stubAdapter('A');
    const b = stubAdapter('B');
    const selector = new SelectorExchangeRateApi(
      { 'exchangerate-api': a, frankfurter: b },
      fixedPreference('frankfurter'),
    );

    const result = await selector.fetchLatest('USD');

    expect(a.calls).toEqual([]);
    expect(b.calls).toEqual(['USD']);
    if (result.ok) expect(result.value['B-rate']).toBe(42);
  });

  it('re-reads the preference on every call, so a runtime change is honored', async () => {
    const a = stubAdapter('A');
    const b = stubAdapter('B');
    let active: RateProvider = 'exchangerate-api';
    const selector = new SelectorExchangeRateApi(
      { 'exchangerate-api': a, frankfurter: b },
      { get: () => active, set: () => undefined },
    );

    await selector.fetchLatest('EUR');
    active = 'frankfurter';
    await selector.fetchLatest('EUR');

    expect(a.calls).toEqual(['EUR']);
    expect(b.calls).toEqual(['EUR']);
  });
});
