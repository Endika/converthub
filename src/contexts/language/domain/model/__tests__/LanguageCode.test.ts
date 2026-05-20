import { describe, expect, it } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { UnsupportedLanguageError } from '../../errors/UnsupportedLanguageError';
import { LanguageCode, SUPPORTED_LANGUAGES } from '../LanguageCode';

describe('LanguageCode', () => {
  it.each(SUPPORTED_LANGUAGES)('parses %s as a valid code', (lang) => {
    const r = LanguageCode.from(lang);
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.value).toBe(lang);
  });

  it('parses uppercase input by normalizing', () => {
    const r = LanguageCode.from('EN');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value.value).toBe('en');
  });

  it('rejects unsupported codes', () => {
    const r = LanguageCode.from('fr');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) {
      expect(r.error).toBeInstanceOf(UnsupportedLanguageError);
      expect(r.error.code).toBe('fr');
    }
  });

  it('fromTrusted builds a code without validation', () => {
    expect(LanguageCode.fromTrusted('eu').value).toBe('eu');
  });

  it('serializes via toString()', () => {
    expect(LanguageCode.fromTrusted('es').toString()).toBe('es');
  });

  it('compares by value (equals)', () => {
    const a = LanguageCode.fromTrusted('en');
    const b = LanguageCode.fromTrusted('en');
    const c = LanguageCode.fromTrusted('es');
    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });
});
