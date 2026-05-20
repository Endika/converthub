import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../shared-kernel/domain/Result';
import { InvalidAmountError } from '../../domain/errors/InvalidAmountError';
import { InvalidUnitError } from '../../domain/errors/InvalidUnitError';
import { SpeedConversionService } from '../../domain/services/SpeedConversionService';
import { ConvertSpeedUseCase } from '../ConvertSpeedUseCase';

const useCase = new ConvertSpeedUseCase(new SpeedConversionService());

describe('ConvertSpeedUseCase', () => {
  it('converts a valid request', () => {
    const r = useCase.execute(100, 'kmh', 'mph');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.value).toBeCloseTo(62.1371, 4);
  });

  it('rejects negative values', () => {
    const r = useCase.execute(-1, 'kmh', 'mph');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidAmountError);
  });

  it('rejects invalid units', () => {
    const a = useCase.execute(1, 'mach', 'kmh');
    const b = useCase.execute(1, 'kmh', 'mach');
    expect(isErr(a)).toBe(true);
    expect(isErr(b)).toBe(true);
    if (isErr(b)) expect(b.error).toBeInstanceOf(InvalidUnitError);
  });
});
