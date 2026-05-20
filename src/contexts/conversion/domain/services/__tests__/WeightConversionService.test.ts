import { describe, expect, it } from 'vitest';
import { Weight } from '../../model/Weight';
import { WeightConversionService } from '../WeightConversionService';

describe('WeightConversionService', () => {
  const service = new WeightConversionService();

  it('converts kg to lb', () => {
    const r = service.convert(Weight.fromTrusted(1, 'kg'), 'lb');
    expect(r.value).toBeCloseTo(2.20462, 4);
  });

  it('converts lb to kg', () => {
    const r = service.convert(Weight.fromTrusted(1, 'lb'), 'kg');
    expect(r.value).toBeCloseTo(0.45359237, 6);
  });

  it('is identity for same unit', () => {
    const w = Weight.fromTrusted(70, 'kg');
    expect(service.convert(w, 'kg')).toBe(w);
  });

  it('converts via grams base across units', () => {
    expect(service.convert(Weight.fromTrusted(1, 'kg'), 'g').value).toBe(1000);
    expect(service.convert(Weight.fromTrusted(1, 't'), 'kg').value).toBe(1000);
    expect(service.convert(Weight.fromTrusted(16, 'oz'), 'lb').value).toBeCloseTo(1, 4);
  });

  it('is bidirectional', () => {
    const kg = Weight.fromTrusted(80, 'kg');
    const back = service.convert(service.convert(kg, 'lb'), 'kg');
    expect(back.value).toBeCloseTo(80, 6);
  });
});
