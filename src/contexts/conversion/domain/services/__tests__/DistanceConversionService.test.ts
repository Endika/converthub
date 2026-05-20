import { describe, expect, it } from 'vitest';
import { Distance } from '../../model/Distance';
import { DistanceConversionService } from '../DistanceConversionService';

describe('DistanceConversionService', () => {
  const service = new DistanceConversionService();

  it('converts km to miles', () => {
    const r = service.convert(Distance.fromTrusted(10, 'km'), 'mi');
    expect(r.unit).toBe('mi');
    expect(r.value).toBeCloseTo(6.21371, 4);
  });

  it('converts miles to km', () => {
    const r = service.convert(Distance.fromTrusted(1, 'mi'), 'km');
    expect(r.value).toBeCloseTo(1.609344, 6);
  });

  it('is identity for same unit', () => {
    const d = Distance.fromTrusted(5, 'km');
    expect(service.convert(d, 'km')).toBe(d);
  });

  it('is bidirectional', () => {
    const km = Distance.fromTrusted(42, 'km');
    const mi = service.convert(km, 'mi');
    const back = service.convert(mi, 'km');
    expect(back.value).toBeCloseTo(42, 6);
  });

  it('converts via meters base for m/cm/mm', () => {
    expect(service.convert(Distance.fromTrusted(1, 'km'), 'm').value).toBe(1000);
    expect(service.convert(Distance.fromTrusted(1, 'm'), 'cm').value).toBe(100);
    expect(service.convert(Distance.fromTrusted(1, 'cm'), 'mm').value).toBe(10);
  });

  it('converts feet, yards and nautical miles', () => {
    expect(service.convert(Distance.fromTrusted(1, 'yd'), 'ft').value).toBeCloseTo(3, 6);
    expect(service.convert(Distance.fromTrusted(1, 'nmi'), 'm').value).toBe(1852);
  });
});
