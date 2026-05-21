import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { InvalidTipInputError } from '../../errors/InvalidTipInputError';
import type { TipInput } from '../../model/TipCalculation';
import { TipCalculator } from '../TipCalculator';

const baseInput = (overrides: Partial<TipInput> = {}): TipInput => ({
  bill: 40,
  billCurrency: 'EUR',
  homeCurrency: 'USD',
  tipPercent: 10,
  splitBetween: 1,
  roundUp: false,
  ...overrides,
});

describe('TipCalculator.calculate', () => {
  const calc = new TipCalculator();

  it('computes tip and total for a simple bill', () => {
    const result = calc.calculate(baseInput());
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    expect(result.value.tipAmount).toBeCloseTo(4);
    expect(result.value.total).toBeCloseTo(44);
    expect(result.value.effectiveTipPercent).toBeCloseTo(10);
  });

  it('returns tip 0 and total equal to bill when tipPercent is 0', () => {
    const result = calc.calculate(baseInput({ tipPercent: 0 }));
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    expect(result.value.tipAmount).toBe(0);
    expect(result.value.total).toBe(40);
  });

  it('splits per-person figures back to the totals within float epsilon', () => {
    const result = calc.calculate(baseInput({ bill: 100, splitBetween: 3 }));
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    const r = result.value;
    expect(r.perPersonBill * 3).toBeCloseTo(100);
    expect(r.perPersonTip * 3).toBeCloseTo(r.tipAmount);
    expect(r.perPersonTotal * 3).toBeCloseTo(r.total);
  });

  it('round-up raises the total to the next integer and absorbs the diff into the tip', () => {
    const result = calc.calculate(
      baseInput({ bill: 33.3, tipPercent: 10, roundUp: true }),
    );
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    expect(result.value.total).toBe(37);
    expect(result.value.tipAmount).toBeCloseTo(3.7);
    expect(result.value.effectiveTipPercent).toBeCloseTo((3.7 / 33.3) * 100);
  });

  it('round-up on an integer total leaves it unchanged', () => {
    const result = calc.calculate(
      baseInput({ bill: 40, tipPercent: 10, roundUp: true }),
    );
    expect(isOk(result)).toBe(true);
    if (!isOk(result)) return;
    expect(result.value.total).toBe(44);
    expect(result.value.tipAmount).toBe(4);
  });

  it('rejects non-positive bill', () => {
    const result = calc.calculate(baseInput({ bill: 0 }));
    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(InvalidTipInputError);
      expect(result.error.field).toBe('bill');
    }
  });

  it('rejects splitBetween < 1', () => {
    const result = calc.calculate(baseInput({ splitBetween: 0 }));
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.field).toBe('splitBetween');
  });

  it('rejects negative tipPercent', () => {
    const result = calc.calculate(baseInput({ tipPercent: -5 }));
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error.field).toBe('tipPercent');
  });
});
