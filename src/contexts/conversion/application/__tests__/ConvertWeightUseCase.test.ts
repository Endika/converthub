import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../shared-kernel/domain/Result';
import { InvalidAmountError } from '../../domain/errors/InvalidAmountError';
import { InvalidUnitError } from '../../domain/errors/InvalidUnitError';
import { WeightConversionService } from '../../domain/services/WeightConversionService';
import { ConvertWeightUseCase } from '../ConvertWeightUseCase';

const useCase = new ConvertWeightUseCase(new WeightConversionService());

describe('ConvertWeightUseCase', () => {
  it('converts a valid request', () => {
    const r = useCase.execute(1, 'kg', 'lb');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.value).toBeCloseTo(2.20462, 4);
  });

  it('rejects negative values', () => {
    const r = useCase.execute(-1, 'kg', 'lb');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidAmountError);
  });

  it('rejects invalid units', () => {
    const a = useCase.execute(1, 'carat', 'kg');
    const b = useCase.execute(1, 'kg', 'carat');
    expect(isErr(a)).toBe(true);
    expect(isErr(b)).toBe(true);
    if (isErr(a)) expect(a.error).toBeInstanceOf(InvalidUnitError);
    if (isErr(b)) expect(b.error).toBeInstanceOf(InvalidUnitError);
  });
});
