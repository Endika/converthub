import { describe, expect, it } from 'vitest';
import { Volume } from '../../model/Volume';
import { VolumeConversionService } from '../VolumeConversionService';

describe('VolumeConversionService', () => {
  const service = new VolumeConversionService();

  it('converts liters to US gallons', () => {
    const r = service.convert(Volume.fromTrusted(10, 'l'), 'gal_us');
    expect(r.value).toBeCloseTo(2.64172, 4);
  });

  it('converts US gallons to UK gallons', () => {
    const r = service.convert(Volume.fromTrusted(1, 'gal_us'), 'gal_uk');
    expect(r.value).toBeCloseTo(0.83267, 4);
  });

  it('is identity for same unit', () => {
    const v = Volume.fromTrusted(1, 'l');
    expect(service.convert(v, 'l')).toBe(v);
  });

  it('converts via milliliters base', () => {
    expect(service.convert(Volume.fromTrusted(1, 'l'), 'ml').value).toBe(1000);
  });

  it('is bidirectional', () => {
    const l = Volume.fromTrusted(5, 'l');
    const back = service.convert(service.convert(l, 'gal_us'), 'l');
    expect(back.value).toBeCloseTo(5, 6);
  });
});
