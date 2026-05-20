import { isOk } from '../../../shared-kernel/domain/Result';
import { LanguageCode } from '../domain/model/LanguageCode';
import type { DetectBrowserLanguagePort } from '../domain/ports/in/DetectBrowserLanguagePort';
import type { BrowserLanguageProviderPort } from '../domain/ports/out/BrowserLanguageProviderPort';

const DEFAULT_LANGUAGE = LanguageCode.fromTrusted('en');

export class DetectBrowserLanguageUseCase
  implements DetectBrowserLanguagePort
{
  constructor(private readonly browser: BrowserLanguageProviderPort) {}

  execute(): LanguageCode {
    const raw = this.browser.getLanguage().toLowerCase();
    const [base = ''] = raw.split('-');
    const parsed = LanguageCode.from(base);
    return isOk(parsed) ? parsed.value : DEFAULT_LANGUAGE;
  }
}
