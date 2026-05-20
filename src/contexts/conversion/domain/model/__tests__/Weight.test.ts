import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { InvalidAmountError } from '../../errors/InvalidAmountError';
import { InvalidUnitError } from '../../errors/InvalidUnitError';
import { Weight } from '../Weight';

describe('Weight', () => {
  it('builds a valid weight', () => {
    const r = Weight.from(2.5, 'kg');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) {
      expect(r.value.value).toBe(2.5);
      expect(r.value.unit).toBe('kg');
    }
  });

  it('rejects negative values', () => {
    const r = Weight.from(-1, 'kg');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidAmountError);
  });

  it('rejects unsupported units', () => {
    const r = Weight.from(1, 'carat');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidUnitError);
  });
});
