import { describe, expect, it } from 'vitest';
import { SUPPORTED_LANGUAGES } from '../../model/LanguageCode';
import { TRANSLATIONS } from '../index';

describe('translations', () => {
  it('has an entry for every supported language', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(TRANSLATIONS[lang]).toBeDefined();
    }
  });

  it('keeps the same set of keys across all languages', () => {
    const reference = Object.keys(TRANSLATIONS.en).sort();
    for (const lang of SUPPORTED_LANGUAGES) {
      expect(Object.keys(TRANSLATIONS[lang]).sort()).toEqual(reference);
    }
  });

  it('has non-empty strings for every key in every language', () => {
    for (const lang of SUPPORTED_LANGUAGES) {
      for (const [key, value] of Object.entries(TRANSLATIONS[lang])) {
        expect(value, `${lang}.${key}`).not.toBe('');
      }
    }
  });
});
