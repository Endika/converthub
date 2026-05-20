import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../shared-kernel/domain/Result';
import { InvalidAmountError } from '../../domain/errors/InvalidAmountError';
import { InvalidUnitError } from '../../domain/errors/InvalidUnitError';
import { DistanceConversionService } from '../../domain/services/DistanceConversionService';
import { ConvertDistanceUseCase } from '../ConvertDistanceUseCase';

const useCase = new ConvertDistanceUseCase(new DistanceConversionService());

describe('ConvertDistanceUseCase', () => {
  it('converts a valid request', () => {
    const r = useCase.execute(10, 'km', 'mi');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.value).toBeCloseTo(6.21371, 4);
  });

  it('rejects negative values', () => {
    const r = useCase.execute(-1, 'km', 'mi');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidAmountError);
  });

  it('rejects invalid source unit', () => {
    const r = useCase.execute(10, 'parsec', 'km');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidUnitError);
  });

  it('rejects invalid target unit', () => {
    const r = useCase.execute(10, 'km', 'parsec');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidUnitError);
  });
});
