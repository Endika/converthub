import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../shared-kernel/domain/Result';
import { InvalidSizeError } from '../../domain/errors/InvalidSizeError';
import { InvalidUnitError } from '../../domain/errors/InvalidUnitError';
import { SizeConversionService } from '../../domain/services/SizeConversionService';
import { ConvertSizeUseCase } from '../ConvertSizeUseCase';

const useCase = new ConvertSizeUseCase(new SizeConversionService());

describe('ConvertSizeUseCase', () => {
  it('converts EU 42 men shoes to US 8.5', () => {
    const r = useCase.execute('42', 'shoes_men', 'eu', 'us');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.label).toBe('8.5');
  });

  it('rejects unknown category', () => {
    const r = useCase.execute('42', 'hats', 'eu', 'us');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidUnitError);
  });

  it('rejects unknown source region', () => {
    const r = useCase.execute('42', 'shoes_men', 'jp', 'us');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidUnitError);
  });

  it('rejects unknown target region', () => {
    const r = useCase.execute('42', 'shoes_men', 'eu', 'jp');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidUnitError);
  });

  it('returns InvalidSizeError when the label is not in the table', () => {
    const r = useCase.execute('999', 'shoes_men', 'eu', 'us');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidSizeError);
  });
});
