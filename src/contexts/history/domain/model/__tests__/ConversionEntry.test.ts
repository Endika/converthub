import { describe, expect, it } from 'vitest';
import { ConversionEntry } from '../ConversionEntry';

describe('ConversionEntry', () => {
  it('creates an entry with a generated id and timestamp', () => {
    const e = ConversionEntry.create({
      type: 'money',
      fromValue: '100',
      fromUnit: 'USD',
      toValue: '92',
      toUnit: 'EUR',
    });
    expect(e.id).toMatch(/^[0-9a-f-]{36}$/i);
    expect(e.type).toBe('money');
    expect(e.timestamp).toBeInstanceOf(Date);
  });

  it('honors an explicit timestamp', () => {
    const t = new Date('2026-05-20T10:00:00Z');
    const e = ConversionEntry.create(
      {
        type: 'distance',
        fromValue: '10',
        fromUnit: 'km',
        toValue: '6.21',
        toUnit: 'mi',
      },
      t,
    );
    expect(e.timestamp).toBe(t);
  });

  it('exposes from/to values via getters', () => {
    const e = ConversionEntry.create({
      type: 'weight',
      fromValue: '1',
      fromUnit: 'kg',
      toValue: '2.20',
      toUnit: 'lb',
    });
    expect(e.fromValue).toBe('1');
    expect(e.fromUnit).toBe('kg');
    expect(e.toValue).toBe('2.20');
    expect(e.toUnit).toBe('lb');
  });
});
