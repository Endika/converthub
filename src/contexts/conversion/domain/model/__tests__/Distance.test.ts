import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { InvalidAmountError } from '../../errors/InvalidAmountError';
import { InvalidUnitError } from '../../errors/InvalidUnitError';
import { Distance } from '../Distance';

describe('Distance', () => {
  it('builds a valid distance', () => {
    const r = Distance.from(10, 'km');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) {
      expect(r.value.value).toBe(10);
      expect(r.value.unit).toBe('km');
    }
  });

  it('rejects negative values', () => {
    const r = Distance.from(-5, 'km');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidAmountError);
  });

  it('rejects non-finite values', () => {
    expect(isErr(Distance.from(Number.NaN, 'km'))).toBe(true);
    expect(isErr(Distance.from(Number.POSITIVE_INFINITY, 'km'))).toBe(true);
  });

  it('rejects unsupported units', () => {
    const r = Distance.from(10, 'parsec');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidUnitError);
  });
});
