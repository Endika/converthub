import { describe, expect, it } from 'vitest';

describe('toolchain smoke', () => {
  it('runs vitest with strict TS', () => {
    const sum = (a: number, b: number): number => a + b;
    expect(sum(2, 3)).toBe(5);
  });
});
