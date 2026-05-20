import type { LanguageCode } from '../model/LanguageCode';
import { TRANSLATIONS } from '../translations';
import type {
  TranslationKey,
  Translations,
} from '../translations/Translations';

export interface LanguageChangedEvent {
  readonly previous: LanguageCode;
  readonly current: LanguageCode;
}

export type LanguageChangeListener = (event: LanguageChangedEvent) => void;

export class LanguageService {
  private current: LanguageCode;
  private readonly listeners: Set<LanguageChangeListener> = new Set();

  constructor(initial: LanguageCode) {
    this.current = initial;
  }

  getCurrent(): LanguageCode {
    return this.current;
  }

  change(next: LanguageCode): void {
    if (this.current.equals(next)) return;
    const previous = this.current;
    this.current = next;
    this.notifyAll({ previous, current: next });
  }

  translate(key: TranslationKey): string {
    return this.currentTranslations()[key];
  }

  onChange(listener: LanguageChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private currentTranslations(): Translations {
    return TRANSLATIONS[this.current.value];
  }

  private notifyAll(event: LanguageChangedEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }
}
