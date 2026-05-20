import type { ChangeLanguageUseCase } from '../../../../contexts/language/application/ChangeLanguageUseCase';
import {
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from '../../../../contexts/language/domain/model/LanguageCode';
import type { LanguageService } from '../../../../contexts/language/domain/services/LanguageService';

const LABELS: Record<SupportedLanguage, string> = {
  en: 'EN',
  es: 'ES',
  eu: 'EU',
};

export class LanguageSelector {
  constructor(
    private readonly root: HTMLElement,
    private readonly languageService: LanguageService,
    private readonly changeLanguageUseCase: ChangeLanguageUseCase,
  ) {
    this.render();
    this.languageService.onChange(() => this.render());
  }

  private render(): void {
    const current = this.languageService.getCurrent().value;
    this.root.innerHTML = SUPPORTED_LANGUAGES.map(
      (lang) => `
        <button
          type="button"
          class="lang-btn${lang === current ? ' is-active' : ''}"
          data-lang="${lang}"
          aria-pressed="${lang === current ? 'true' : 'false'}"
        >${LABELS[lang]}</button>
      `,
    ).join('');
    this.attach();
  }

  private attach(): void {
    this.root
      .querySelectorAll<HTMLButtonElement>('[data-lang]')
      .forEach((btn) => {
        btn.addEventListener('click', () => {
          const lang = btn.dataset['lang'];
          if (lang !== undefined) this.changeLanguageUseCase.execute(lang);
        });
      });
  }
}
