import { describe, expect, it } from 'vitest';
import { Favorite } from '../Favorite';

describe('Favorite', () => {
  it('creates a favorite with generated id and createdAt', () => {
    const f = Favorite.create({
      type: 'money',
      fromUnit: 'USD',
      toUnit: 'EUR',
      label: 'USD -> EUR',
    });
    expect(f.id).toMatch(/^[0-9a-f-]{36}$/i);
    expect(f.label).toBe('USD -> EUR');
    expect(f.createdAt).toBeInstanceOf(Date);
  });

  it('honors an explicit createdAt', () => {
    const t = new Date('2026-05-20');
    const f = Favorite.create(
      { type: 'distance', fromUnit: 'km', toUnit: 'mi', label: 'km->mi' },
      t,
    );
    expect(f.createdAt).toBe(t);
  });
});
