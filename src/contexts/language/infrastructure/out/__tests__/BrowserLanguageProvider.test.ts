import { describe, expect, it, vi } from 'vitest';
import { BrowserLanguageProvider } from '../BrowserLanguageProvider';

describe('BrowserLanguageProvider', () => {
  it('delegates to navigator.language', () => {
    const spy = vi.spyOn(navigator, 'language', 'get').mockReturnValue('eu-ES');
    expect(new BrowserLanguageProvider().getLanguage()).toBe('eu-ES');
    spy.mockRestore();
  });
});
