import { describe, expect, it } from 'vitest';
import { ConvertMoneyUseCase } from '../../../../contexts/conversion/application/ConvertMoneyUseCase';
import { ChangeLanguageUseCase } from '../../../../contexts/language/application/ChangeLanguageUseCase';
import type { LanguageService } from '../../../../contexts/language/domain/services/LanguageService';
import { buildContainer, SERVICES } from '../setup';

describe('setup', () => {
  it('resolves the language service with a usable default language', () => {
    const c = buildContainer();
    const service = c.get<LanguageService>(SERVICES.languageService);
    expect(['en', 'es', 'eu']).toContain(service.getCurrent().value);
  });

  it('honors a previously saved language from localStorage', () => {
    localStorage.setItem('converthub:language', 'eu');
    const c = buildContainer();
    const service = c.get<LanguageService>(SERVICES.languageService);
    expect(service.getCurrent().value).toBe('eu');
    localStorage.removeItem('converthub:language');
  });

  it('resolves use cases that wire across bounded contexts', () => {
    const c = buildContainer();
    expect(c.get(SERVICES.changeLanguageUseCase)).toBeInstanceOf(
      ChangeLanguageUseCase,
    );
    expect(c.get(SERVICES.convertMoneyUseCase)).toBeInstanceOf(
      ConvertMoneyUseCase,
    );
  });

  it('registers and resolves every declared service', () => {
    const c = buildContainer();
    for (const key of Object.values(SERVICES)) {
      expect(c.has(key)).toBe(true);
      expect(c.get(key)).toBeDefined();
    }
  });
});
