import { describe, expect, it } from 'vitest';
import type { BrowserLanguageProviderPort } from '../../domain/ports/out/BrowserLanguageProviderPort';
import { DetectBrowserLanguageUseCase } from '../DetectBrowserLanguageUseCase';

const provider = (raw: string): BrowserLanguageProviderPort => ({
  getLanguage: () => raw,
});

describe('DetectBrowserLanguageUseCase', () => {
  it('returns the supported language directly when given a plain code', () => {
    const useCase = new DetectBrowserLanguageUseCase(provider('es'));
    expect(useCase.execute().value).toBe('es');
  });

  it('strips region subtag (e.g. es-AR -> es)', () => {
    const useCase = new DetectBrowserLanguageUseCase(provider('es-AR'));
    expect(useCase.execute().value).toBe('es');
  });

  it('is case insensitive', () => {
    const useCase = new DetectBrowserLanguageUseCase(provider('EU-ES'));
    expect(useCase.execute().value).toBe('eu');
  });

  it('falls back to en when the browser language is not supported', () => {
    const useCase = new DetectBrowserLanguageUseCase(provider('fr-FR'));
    expect(useCase.execute().value).toBe('en');
  });

  it('falls back to en when the browser returns an empty string', () => {
    const useCase = new DetectBrowserLanguageUseCase(provider(''));
    expect(useCase.execute().value).toBe('en');
  });
});
