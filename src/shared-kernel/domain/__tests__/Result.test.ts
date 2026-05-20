import { describe, expect, it } from 'vitest';
import { err, isErr, isOk, ok, type Result } from '../Result';

describe('Result', () => {
  it('wraps a value in an Ok result', () => {
    const r = ok(42);
    expect(r.ok).toBe(true);
    expect(r.value).toBe(42);
  });

  it('wraps an error in an Err result', () => {
    const r = err('boom');
    expect(r.ok).toBe(false);
    expect(r.error).toBe('boom');
  });

  it('isOk narrows the union to Ok', () => {
    const r: Result<number, string> = ok(1);
    expect(isOk(r)).toBe(true);
    expect(isErr(r)).toBe(false);
    if (isOk(r)) {
      expect(r.value).toBe(1);
    }
  });

  it('isErr narrows the union to Err', () => {
    const r: Result<number, string> = err('nope');
    expect(isErr(r)).toBe(true);
    expect(isOk(r)).toBe(false);
    if (isErr(r)) {
      expect(r.error).toBe('nope');
    }
  });
});
