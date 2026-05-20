import { describe, expect, it } from 'vitest';
import {
  err,
  isErr,
  isOk,
  ok,
} from '../../../../shared-kernel/domain/Result';
import { RateNotAvailableError } from '../../../conversion/domain/errors/RateNotAvailableError';
import { CurrencyCode } from '../../../conversion/domain/model/CurrencyCode';
import { RateNotFoundError } from '../../domain/errors/RateNotFoundError';
import type { GetExchangeRatePort } from '../../domain/ports/in/GetExchangeRatePort';
import { ExchangeRateProviderAdapter } from '../ExchangeRateProviderAdapter';

describe('ExchangeRateProviderAdapter', () => {
  it('returns the rate from the use case when available', () => {
    const port: GetExchangeRatePort = {
      execute: () => ok(0.92),
    };
    const adapter = new ExchangeRateProviderAdapter(port);
    const result = adapter.getRate(CurrencyCode.fromTrusted('EUR'));
    expect(isOk(result)).toBe(true);
    if (isOk(result)) expect(result.value).toBe(0.92);
  });

  it('translates RateNotFoundError into RateNotAvailableError', () => {
    const port: GetExchangeRatePort = {
      execute: () => err(new RateNotFoundError('EUR')),
    };
    const adapter = new ExchangeRateProviderAdapter(port);
    const result = adapter.getRate(CurrencyCode.fromTrusted('EUR'));
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(RateNotAvailableError);
      expect(result.error.currency).toBe('EUR');
    }
  });
});
