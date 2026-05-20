import { describe, expect, it, vi } from 'vitest';
import { Container } from '../Container';

describe('Container', () => {
  it('returns the same instance on repeated get (singleton)', () => {
    const c = new Container();
    const factory = vi.fn(() => ({ id: 1 }));
    c.registerSingleton('svc', factory);
    expect(c.get('svc')).toBe(c.get('svc'));
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('throws when getting an unregistered key', () => {
    const c = new Container();
    expect(() => c.get('missing')).toThrow(/missing/);
  });

  it('reports whether a key is registered', () => {
    const c = new Container();
    expect(c.has('svc')).toBe(false);
    c.registerSingleton('svc', () => 1);
    expect(c.has('svc')).toBe(true);
  });

  it('resolves dependencies between services', () => {
    const c = new Container();
    c.registerSingleton('a', () => ({ value: 1 }));
    c.registerSingleton('b', () => ({ a: c.get<{ value: number }>('a') }));
    const b = c.get<{ a: { value: number } }>('b');
    expect(b.a.value).toBe(1);
  });
});
