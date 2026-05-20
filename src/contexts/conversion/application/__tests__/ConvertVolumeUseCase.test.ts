import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../shared-kernel/domain/Result';
import { InvalidAmountError } from '../../domain/errors/InvalidAmountError';
import { InvalidUnitError } from '../../domain/errors/InvalidUnitError';
import { VolumeConversionService } from '../../domain/services/VolumeConversionService';
import { ConvertVolumeUseCase } from '../ConvertVolumeUseCase';

const useCase = new ConvertVolumeUseCase(new VolumeConversionService());

describe('ConvertVolumeUseCase', () => {
  it('converts a valid request', () => {
    const r = useCase.execute(10, 'l', 'gal_us');
    expect(isOk(r)).toBe(true);
  });

  it('rejects negative values', () => {
    const r = useCase.execute(-1, 'l', 'ml');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidAmountError);
  });

  it('rejects invalid units', () => {
    const a = useCase.execute(1, 'barrel', 'l');
    const b = useCase.execute(1, 'l', 'barrel');
    expect(isErr(a)).toBe(true);
    expect(isErr(b)).toBe(true);
    if (isErr(b)) expect(b.error).toBeInstanceOf(InvalidUnitError);
  });
});
