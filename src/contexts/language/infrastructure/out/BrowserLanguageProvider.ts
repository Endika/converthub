import type { BrowserLanguageProviderPort } from '../../domain/ports/out/BrowserLanguageProviderPort';

export class BrowserLanguageProvider implements BrowserLanguageProviderPort {
  getLanguage(): string {
    return navigator.language;
  }
}
