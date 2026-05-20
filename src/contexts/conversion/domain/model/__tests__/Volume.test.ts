import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { InvalidAmountError } from '../../errors/InvalidAmountError';
import { InvalidUnitError } from '../../errors/InvalidUnitError';
import { Volume } from '../Volume';

describe('Volume', () => {
  it('builds a valid volume', () => {
    const r = Volume.from(1.5, 'l');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.unit).toBe('l');
  });

  it('rejects negative values', () => {
    expect(isErr(Volume.from(-1, 'l'))).toBe(true);
    const r = Volume.from(-1, 'l');
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidAmountError);
  });

  it('rejects unsupported units', () => {
    const r = Volume.from(1, 'barrel');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidUnitError);
  });
});
