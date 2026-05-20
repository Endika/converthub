import type { SupportedLanguage } from '../../model/LanguageCode';

export interface LanguageRepositoryPort {
  load(): SupportedLanguage | null;
  save(code: SupportedLanguage): void;
}
