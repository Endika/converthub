import { describe, expect, it } from 'vitest';
import { ExchangeRateSnapshot } from '../ExchangeRateSnapshot';

describe('ExchangeRateSnapshot', () => {
  it('exposes rate lookup', () => {
    const s = new ExchangeRateSnapshot(
      'USD',
      { EUR: 0.92, GBP: 0.79 },
      new Date(),
    );
    expect(s.getRate('EUR')).toBe(0.92);
    expect(s.getRate('JPY')).toBeUndefined();
  });

  it('freezes the rates map', () => {
    const s = new ExchangeRateSnapshot('USD', { EUR: 0.92 }, new Date());
    expect(() => {
      (s.rates as Record<string, number>)['EUR'] = 1;
    }).toThrow();
  });

  it('reports stale when older than maxAge', () => {
    const fetched = new Date('2026-01-01T00:00:00Z');
    const now = new Date('2026-01-02T00:01:00Z');
    const s = new ExchangeRateSnapshot('USD', {}, fetched);
    expect(s.isStale(now, 24 * 60 * 60 * 1000)).toBe(true);
  });

  it('reports fresh when within maxAge', () => {
    const fetched = new Date('2026-01-01T00:00:00Z');
    const now = new Date('2026-01-01T23:00:00Z');
    const s = new ExchangeRateSnapshot('USD', {}, fetched);
    expect(s.isStale(now, 24 * 60 * 60 * 1000)).toBe(false);
  });
});
