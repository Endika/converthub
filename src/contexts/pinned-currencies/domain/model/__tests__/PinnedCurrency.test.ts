import { describe, expect, it } from 'vitest';
import { PinnedCurrency } from '../PinnedCurrency';

describe('PinnedCurrency', () => {
  it('defaults pinnedAt to now', () => {
    const before = Date.now();
    const p = new PinnedCurrency('USD');
    const after = Date.now();
    expect(p.pinnedAt.getTime()).toBeGreaterThanOrEqual(before);
    expect(p.pinnedAt.getTime()).toBeLessThanOrEqual(after);
  });

  it('honors an explicit pinnedAt', () => {
    const t = new Date('2026-05-20');
    expect(new PinnedCurrency('GBP', t).pinnedAt).toBe(t);
  });

  it('is equal when codes match', () => {
    expect(new PinnedCurrency('EUR').equals(new PinnedCurrency('EUR'))).toBe(
      true,
    );
    expect(new PinnedCurrency('EUR').equals(new PinnedCurrency('USD'))).toBe(
      false,
    );
  });
});
