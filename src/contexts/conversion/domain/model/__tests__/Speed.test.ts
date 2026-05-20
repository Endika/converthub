import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { InvalidAmountError } from '../../errors/InvalidAmountError';
import { InvalidUnitError } from '../../errors/InvalidUnitError';
import { Speed } from '../Speed';

describe('Speed', () => {
  it('builds a valid speed', () => {
    const r = Speed.from(100, 'kmh');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.unit).toBe('kmh');
  });

  it('rejects negative values', () => {
    const r = Speed.from(-10, 'kmh');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidAmountError);
  });

  it('rejects unsupported units', () => {
    const r = Speed.from(10, 'mach');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidUnitError);
  });
});
