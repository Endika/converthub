import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { InvalidUnitError } from '../../errors/InvalidUnitError';
import { Size } from '../Size';

describe('Size', () => {
  it('builds a valid size', () => {
    const r = Size.from('42', 'shoes_men', 'eu');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) {
      expect(r.value.label).toBe('42');
      expect(r.value.category).toBe('shoes_men');
      expect(r.value.region).toBe('eu');
    }
  });

  it('rejects unknown category', () => {
    const r = Size.from('42', 'hats', 'eu');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidUnitError);
  });

  it('rejects unknown region', () => {
    const r = Size.from('42', 'shoes_men', 'jp');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidUnitError);
  });
});
