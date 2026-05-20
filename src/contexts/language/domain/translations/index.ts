import type { SupportedLanguage } from '../model/LanguageCode';
import type { Translations } from './Translations';
import en from './en';
import es from './es';
import eu from './eu';

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  en,
  es,
  eu,
};
