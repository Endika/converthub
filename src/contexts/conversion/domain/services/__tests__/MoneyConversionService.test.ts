import { describe, expect, it } from 'vitest';
import {
  err,
  isErr,
  isOk,
  ok,
  type Result,
} from '../../../../../shared-kernel/domain/Result';
import { RateNotAvailableError } from '../../errors/RateNotAvailableError';
import { CurrencyCode } from '../../model/CurrencyCode';
import { Money } from '../../model/Money';
import type { ExchangeRateProviderPort } from '../../ports/out/ExchangeRateProviderPort';
import { MoneyConversionService } from '../MoneyConversionService';

const rates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
};

const provider: ExchangeRateProviderPort = {
  getRate(currency: CurrencyCode): Result<number, RateNotAvailableError> {
    const rate = rates[currency.value];
    if (rate === undefined)
      return err(new RateNotAvailableError(currency.value));
    return ok(rate);
  },
};

const USD = CurrencyCode.fromTrusted('USD');
const EUR = CurrencyCode.fromTrusted('EUR');
const GBP = CurrencyCode.fromTrusted('GBP');

describe('MoneyConversionService', () => {
  it('converts USD to EUR using provided rates', () => {
    const service = new MoneyConversionService(provider);
    const result = service.convert(Money.fromTrusted(100, USD), EUR);
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.amount).toBeCloseTo(92, 4);
      expect(result.value.currency.value).toBe('EUR');
    }
  });

  it('is identity when source and target currency match', () => {
    const service = new MoneyConversionService(provider);
    const money = Money.fromTrusted(50, USD);
    const result = service.convert(money, USD);
    expect(isOk(result)).toBe(true);
    if (isOk(result)) expect(result.value.equals(money)).toBe(true);
  });

  it('is bidirectional (USD->EUR->USD round trip)', () => {
    const service = new MoneyConversionService(provider);
    const eur = service.convert(Money.fromTrusted(100, USD), EUR);
    if (!isOk(eur)) throw new Error('expected ok');
    const usd = service.convert(eur.value, USD);
    if (!isOk(usd)) throw new Error('expected ok');
    expect(usd.value.amount).toBeCloseTo(100, 4);
  });

  it('uses cross-rates for non-USD pairs (EUR -> GBP)', () => {
    const service = new MoneyConversionService(provider);
    const result = service.convert(Money.fromTrusted(100, EUR), GBP);
    expect(isOk(result)).toBe(true);
    if (isOk(result)) {
      expect(result.value.amount).toBeCloseTo((100 * 0.79) / 0.92, 4);
    }
  });

  it('returns RateNotAvailableError when source rate is missing', () => {
    const empty: ExchangeRateProviderPort = {
      getRate: (c) => err(new RateNotAvailableError(c.value)),
    };
    const service = new MoneyConversionService(empty);
    const result = service.convert(Money.fromTrusted(10, USD), EUR);
    expect(isErr(result)).toBe(true);
    if (isErr(result))
      expect(result.error).toBeInstanceOf(RateNotAvailableError);
  });

  it('returns RateNotAvailableError when target rate is missing', () => {
    const partial: ExchangeRateProviderPort = {
      getRate: (c) =>
        c.value === 'USD' ? ok(1) : err(new RateNotAvailableError(c.value)),
    };
    const service = new MoneyConversionService(partial);
    const result = service.convert(Money.fromTrusted(10, USD), EUR);
    expect(isErr(result)).toBe(true);
  });
});
