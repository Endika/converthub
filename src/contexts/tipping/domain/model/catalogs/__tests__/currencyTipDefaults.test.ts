import { describe, expect, it } from 'vitest';
import { defaultTipFor } from '../currencyTipDefaults';

describe('defaultTipFor', () => {
  it('returns the configured percent for known currencies', () => {
    expect(defaultTipFor('USD')).toBe(18);
    expect(defaultTipFor('JPY')).toBe(0);
    expect(defaultTipFor('EUR')).toBe(10);
  });

  it('falls back to 10 for unknown currencies', () => {
    expect(defaultTipFor('XYZ')).toBe(10);
  });

  it('treats lowercase input the same as uppercase', () => {
    expect(defaultTipFor('usd')).toBe(18);
  });
});
