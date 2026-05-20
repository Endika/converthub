import {
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '../../domain/model/LanguageCode';
import type { LanguageRepositoryPort } from '../../domain/ports/out/LanguageRepositoryPort';

const STORAGE_KEY = 'converthub:language';

const isSupported = (raw: string): raw is SupportedLanguage =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(raw);

export class LocalStorageLanguageRepository implements LanguageRepositoryPort {
  constructor(private readonly storage: Storage = localStorage) {}

  load(): SupportedLanguage | null {
    const raw = this.storage.getItem(STORAGE_KEY);
    if (raw === null) return null;
    return isSupported(raw) ? raw : null;
  }

  save(code: SupportedLanguage): void {
    this.storage.setItem(STORAGE_KEY, code);
  }
}
