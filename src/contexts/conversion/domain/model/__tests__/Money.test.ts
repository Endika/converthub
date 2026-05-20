import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { InvalidAmountError } from '../../errors/InvalidAmountError';
import { CurrencyCode } from '../CurrencyCode';
import { Money } from '../Money';

const USD = CurrencyCode.fromTrusted('USD');
const EUR = CurrencyCode.fromTrusted('EUR');

describe('Money', () => {
  it('builds money with a non-negative amount and a currency', () => {
    const r = Money.from(100, USD);
    expect(isOk(r)).toBe(true);
    if (isOk(r)) {
      expect(r.value.amount).toBe(100);
      expect(r.value.currency.value).toBe('USD');
    }
  });

  it('accepts zero as a valid amount', () => {
    expect(isOk(Money.from(0, USD))).toBe(true);
  });

  it('rejects negative amounts', () => {
    const r = Money.from(-1, USD);
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidAmountError);
  });

  it('rejects non-finite amounts', () => {
    expect(isErr(Money.from(Number.NaN, USD))).toBe(true);
    expect(isErr(Money.from(Number.POSITIVE_INFINITY, USD))).toBe(true);
  });

  it('compares by amount and currency', () => {
    const a = Money.fromTrusted(100, USD);
    const b = Money.fromTrusted(100, USD);
    const c = Money.fromTrusted(100, EUR);
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });
});
