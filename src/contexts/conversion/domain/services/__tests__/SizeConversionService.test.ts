import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { InvalidSizeError } from '../../errors/InvalidSizeError';
import { Size } from '../../model/Size';
import { SizeConversionService } from '../SizeConversionService';

describe('SizeConversionService', () => {
  const service = new SizeConversionService();

  it('converts EU 42 men shoes to US 8.5', () => {
    const r = service.convert(
      Size.fromTrusted('42', 'shoes_men', 'eu'),
      'us',
    );
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.label).toBe('8.5');
  });

  it('converts US S men clothing to EU 46', () => {
    const r = service.convert(
      Size.fromTrusted('S', 'clothing_men', 'us'),
      'eu',
    );
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.label).toBe('46');
  });

  it('is identity for same region', () => {
    const size = Size.fromTrusted('42', 'shoes_men', 'eu');
    const r = service.convert(size, 'eu');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value).toBe(size);
  });

  it('returns InvalidSizeError when label is not in the table', () => {
    const r = service.convert(
      Size.fromTrusted('999', 'shoes_men', 'eu'),
      'us',
    );
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidSizeError);
  });
});
