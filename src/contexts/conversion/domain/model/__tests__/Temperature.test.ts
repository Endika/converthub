import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { InvalidAmountError } from '../../errors/InvalidAmountError';
import { InvalidUnitError } from '../../errors/InvalidUnitError';
import { Temperature } from '../Temperature';

describe('Temperature', () => {
  it('accepts negative values (e.g. -40°C)', () => {
    const r = Temperature.from(-40, 'c');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.value).toBe(-40);
  });

  it('accepts zero', () => {
    expect(isOk(Temperature.from(0, 'k'))).toBe(true);
  });

  it('rejects non-finite values', () => {
    const r = Temperature.from(Number.NaN, 'c');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidAmountError);
  });

  it('rejects unsupported units', () => {
    const r = Temperature.from(25, 'rankine');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidUnitError);
  });
});
