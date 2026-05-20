import { beforeEach, describe, expect, it } from 'vitest';
import { ChangeLanguageUseCase } from '../../../../../contexts/language/application/ChangeLanguageUseCase';
import { LanguageCode } from '../../../../../contexts/language/domain/model/LanguageCode';
import type { LanguageRepositoryPort } from '../../../../../contexts/language/domain/ports/out/LanguageRepositoryPort';
import { LanguageService } from '../../../../../contexts/language/domain/services/LanguageService';
import { LanguageSelector } from '../LanguageSelector';

const buildRepo = (): LanguageRepositoryPort => {
  let saved: string | null = null;
  return {
    load: () => saved as never,
    save: (code) => {
      saved = code;
    },
  };
};

describe('LanguageSelector', () => {
  let root: HTMLElement;
  let service: LanguageService;
  let useCase: ChangeLanguageUseCase;

  beforeEach(() => {
    root = document.createElement('div');
    service = new LanguageService(LanguageCode.fromTrusted('en'));
    useCase = new ChangeLanguageUseCase(service, buildRepo());
  });

  it('renders one button per supported language with current marked', () => {
    new LanguageSelector(root, service, useCase);
    const buttons = root.querySelectorAll<HTMLButtonElement>('[data-lang]');
    expect(buttons).toHaveLength(3);
    const active = root.querySelector('.lang-btn.is-active');
    expect(active?.getAttribute('data-lang')).toBe('en');
  });

  it('changes the language when a button is clicked', () => {
    new LanguageSelector(root, service, useCase);
    const esBtn = root.querySelector<HTMLButtonElement>('[data-lang="es"]');
    esBtn?.click();
    expect(service.getCurrent().value).toBe('es');
  });

  it('re-renders when language changes externally', () => {
    new LanguageSelector(root, service, useCase);
    service.change(LanguageCode.fromTrusted('eu'));
    const active = root.querySelector('.lang-btn.is-active');
    expect(active?.getAttribute('data-lang')).toBe('eu');
  });
});
