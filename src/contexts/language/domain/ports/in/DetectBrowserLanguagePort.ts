import type { LanguageCode } from '../../model/LanguageCode';

export interface DetectBrowserLanguagePort {
  execute(): LanguageCode;
}
