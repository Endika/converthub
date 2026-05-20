import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../shared-kernel/domain/Result';
import { InvalidUnitError } from '../../domain/errors/InvalidUnitError';
import { TemperatureConversionService } from '../../domain/services/TemperatureConversionService';
import { ConvertTemperatureUseCase } from '../ConvertTemperatureUseCase';

const useCase = new ConvertTemperatureUseCase(
  new TemperatureConversionService(),
);

describe('ConvertTemperatureUseCase', () => {
  it('converts 100°C to 212°F', () => {
    const r = useCase.execute(100, 'c', 'f');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.value).toBeCloseTo(212, 6);
  });

  it('accepts negative values (e.g. -40°F)', () => {
    const r = useCase.execute(-40, 'f', 'c');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.value).toBeCloseTo(-40, 6);
  });

  it('rejects invalid source unit', () => {
    const r = useCase.execute(0, 'rankine', 'c');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidUnitError);
  });

  it('rejects invalid target unit', () => {
    const r = useCase.execute(0, 'c', 'rankine');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(InvalidUnitError);
  });
});
