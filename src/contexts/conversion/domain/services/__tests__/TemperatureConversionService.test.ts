import { describe, expect, it } from 'vitest';
import { Temperature } from '../../model/Temperature';
import { TemperatureConversionService } from '../TemperatureConversionService';

describe('TemperatureConversionService', () => {
  const service = new TemperatureConversionService();

  it('converts 0°C to 32°F', () => {
    const r = service.convert(Temperature.fromTrusted(0, 'c'), 'f');
    expect(r.value).toBeCloseTo(32, 6);
  });

  it('converts 100°C to 212°F', () => {
    const r = service.convert(Temperature.fromTrusted(100, 'c'), 'f');
    expect(r.value).toBeCloseTo(212, 6);
  });

  it('converts 0°C to 273.15 K', () => {
    const r = service.convert(Temperature.fromTrusted(0, 'c'), 'k');
    expect(r.value).toBeCloseTo(273.15, 6);
  });

  it('converts -40°C to -40°F (the famous crossover)', () => {
    const r = service.convert(Temperature.fromTrusted(-40, 'c'), 'f');
    expect(r.value).toBeCloseTo(-40, 6);
  });

  it('converts Fahrenheit to Kelvin', () => {
    const r = service.convert(Temperature.fromTrusted(32, 'f'), 'k');
    expect(r.value).toBeCloseTo(273.15, 6);
  });

  it('converts Kelvin to Fahrenheit', () => {
    const r = service.convert(Temperature.fromTrusted(273.15, 'k'), 'f');
    expect(r.value).toBeCloseTo(32, 6);
  });

  it('is identity for same unit', () => {
    const t = Temperature.fromTrusted(20, 'c');
    expect(service.convert(t, 'c')).toBe(t);
  });

  it('is bidirectional', () => {
    const c = Temperature.fromTrusted(25, 'c');
    const back = service.convert(service.convert(c, 'f'), 'c');
    expect(back.value).toBeCloseTo(25, 6);
  });
});
