import { describe, expect, it } from 'vitest';
import { Speed } from '../../model/Speed';
import { SpeedConversionService } from '../SpeedConversionService';

describe('SpeedConversionService', () => {
  const service = new SpeedConversionService();

  it('converts kmh to mph', () => {
    const r = service.convert(Speed.fromTrusted(100, 'kmh'), 'mph');
    expect(r.value).toBeCloseTo(62.1371, 4);
  });

  it('converts kmh to m/s', () => {
    const r = service.convert(Speed.fromTrusted(36, 'kmh'), 'ms');
    expect(r.value).toBeCloseTo(10, 6);
  });

  it('converts knots to mph', () => {
    const r = service.convert(Speed.fromTrusted(1, 'kn'), 'mph');
    expect(r.value).toBeCloseTo(1.15078, 4);
  });

  it('is identity for same unit', () => {
    const s = Speed.fromTrusted(50, 'kmh');
    expect(service.convert(s, 'kmh')).toBe(s);
  });

  it('is bidirectional', () => {
    const kmh = Speed.fromTrusted(120, 'kmh');
    const back = service.convert(service.convert(kmh, 'mph'), 'kmh');
    expect(back.value).toBeCloseTo(120, 6);
  });
});
