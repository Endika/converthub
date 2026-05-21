import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../shared-kernel/domain/Result';
import type { RateConverterPort } from '../../domain/ports/out/RateConverterPort';
import { TipCalculator } from '../../domain/services/TipCalculator';
import { CalculateTipUseCase } from '../CalculateTipUseCase';

class FixedRateConverter implements RateConverterPort {
  constructor(private readonly rates: Record<string, number>) {}
  convert(amount: number, from: string, to: string): number | null {
    if (from === to) return amount;
    const factor = this.rates[`${from}>${to}`];
    return factor === undefined ? null : amount * factor;
  }
}

const makeUseCase = (converter: RateConverterPort): CalculateTipUseCase =>
  new CalculateTipUseCase(new TipCalculator(), converter);

describe('CalculateTipUseCase', () => {
  it('fills home fields when a rate is available', () => {
    const useCase = makeUseCase(new FixedRateConverter({ 'EUR>USD': 1.1 }));
    const result = useCase.execute({
      bill: 40,
      billCurrency: 'EUR',
      homeCurrency: 'USD',
      tipPercent: 10,
      splitBetween: 1,
      roundUp: false,
    });
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    expect(result.value.total).toBeCloseTo(44);
    expect(result.value.tipAmountHome).toBeCloseTo(4.4);
    expect(result.value.totalHome).toBeCloseTo(48.4);
    expect(result.value.perPersonTotalHome).toBeCloseTo(48.4);
  });

  it('sets home fields equal to local fields when bill currency equals home currency', () => {
    const useCase = makeUseCase(new FixedRateConverter({}));
    const result = useCase.execute({
      bill: 40,
      billCurrency: 'EUR',
      homeCurrency: 'EUR',
      tipPercent: 10,
      splitBetween: 2,
      roundUp: false,
    });
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    expect(result.value.tipAmountHome).toBeCloseTo(result.value.tipAmount);
    expect(result.value.totalHome).toBeCloseTo(result.value.total);
    expect(result.value.perPersonTotalHome).toBeCloseTo(
      result.value.perPersonTotal,
    );
  });

  it('sets home fields to null when no rate is available', () => {
    const useCase = makeUseCase(new FixedRateConverter({}));
    const result = useCase.execute({
      bill: 5000,
      billCurrency: 'JPY',
      homeCurrency: 'EUR',
      tipPercent: 0,
      splitBetween: 1,
      roundUp: false,
    });
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    expect(result.value.tipAmountHome).toBeNull();
    expect(result.value.totalHome).toBeNull();
    expect(result.value.perPersonTotalHome).toBeNull();
  });

  it('propagates domain errors from invalid input', () => {
    const useCase = makeUseCase(new FixedRateConverter({}));
    const result = useCase.execute({
      bill: -1,
      billCurrency: 'EUR',
      homeCurrency: 'USD',
      tipPercent: 10,
      splitBetween: 1,
      roundUp: false,
    });
    expect(isErr(result)).toBe(true);
  });
});
