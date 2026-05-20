import { describe, expect, it } from 'vitest';
import {
  err,
  isErr,
  isOk,
  ok,
  type Result,
} from '../../../../shared-kernel/domain/Result';
import { InvalidAmountError } from '../../domain/errors/InvalidAmountError';
import { InvalidCurrencyError } from '../../domain/errors/InvalidCurrencyError';
import { RateNotAvailableError } from '../../domain/errors/RateNotAvailableError';
import type { CurrencyCode } from '../../domain/model/CurrencyCode';
import type { ExchangeRateProviderPort } from '../../domain/ports/out/ExchangeRateProviderPort';
import { MoneyConversionService } from '../../domain/services/MoneyConversionService';
import { ConvertMoneyUseCase } from '../ConvertMoneyUseCase';

const buildProvider = (
  rates: Record<string, number>,
): ExchangeRateProviderPort => ({
  getRate(c: CurrencyCode): Result<number, RateNotAvailableError> {
    const r = rates[c.value];
    return r === undefined ? err(new RateNotAvailableError(c.value)) : ok(r);
  },
});

const buildUseCase = (rates: Record<string, number>): ConvertMoneyUseCase => {
  const service = new MoneyConversionService(buildProvider(rates));
  return new ConvertMoneyUseCase(service);
};

describe('ConvertMoneyUseCase', () => {
  it('converts a valid request', () => {
    const useCase = buildUseCase({ USD: 1, EUR: 0.92 });
    const r = useCase.execute(100, 'USD', 'EUR');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.amount).toBeCloseTo(92, 4);
  });

  it('rejects invalid source currency', () => {
    const useCase = buildUseCase({ USD: 1 });
    const r = useCase.execute(100, 'XYZ', 'EUR');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidCurrencyError);
  });

  it('rejects invalid target currency', () => {
    const useCase = buildUseCase({ USD: 1 });
    const r = useCase.execute(100, 'USD', 'XYZ');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidCurrencyError);
  });

  it('rejects negative amounts', () => {
    const useCase = buildUseCase({ USD: 1, EUR: 0.92 });
    const r = useCase.execute(-1, 'USD', 'EUR');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidAmountError);
  });

  it('propagates RateNotAvailableError from the provider', () => {
    const useCase = buildUseCase({ USD: 1 });
    const r = useCase.execute(100, 'USD', 'EUR');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(RateNotAvailableError);
  });
});
