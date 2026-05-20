import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { InvalidCurrencyError } from '../../errors/InvalidCurrencyError';
import { CurrencyCode } from '../CurrencyCode';

describe('CurrencyCode', () => {
  it('accepts a supported uppercase code', () => {
    const r = CurrencyCode.from('USD');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.value).toBe('USD');
  });

  it('normalizes lowercase input', () => {
    const r = CurrencyCode.from('eur');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.value).toBe('EUR');
  });

  it('rejects unsupported codes', () => {
    const r = CurrencyCode.from('XYZ');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) {
      expect(r.error).toBeInstanceOf(InvalidCurrencyError);
      expect(r.error.code).toBe('XYZ');
    }
  });

  it('fromTrusted bypasses validation', () => {
    expect(CurrencyCode.fromTrusted('JPY').value).toBe('JPY');
  });

  it('serializes via toString()', () => {
    expect(CurrencyCode.fromTrusted('GBP').toString()).toBe('GBP');
  });

  it('compares equal codes by value', () => {
    const a = CurrencyCode.fromTrusted('USD');
    const b = CurrencyCode.fromTrusted('USD');
    const c = CurrencyCode.fromTrusted('EUR');
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });
});
