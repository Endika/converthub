import type { ClearHistoryUseCase } from '../../../../contexts/history/application/ClearHistoryUseCase';
import type { GetHistoryUseCase } from '../../../../contexts/history/application/GetHistoryUseCase';
import type { LanguageService } from '../../../../contexts/language/domain/services/LanguageService';
import type { TranslationKey } from '../../../../contexts/language/domain/translations/Translations';

export class HistoryList {
  private readonly unsubscribe: () => void;

  constructor(
    private readonly root: HTMLElement,
    private readonly languageService: LanguageService,
    private readonly getHistoryUseCase: GetHistoryUseCase,
    private readonly clearHistoryUseCase: ClearHistoryUseCase,
  ) {
    this.render();
    this.unsubscribe = this.languageService.onChange(() => this.render());
  }

  destroy(): void {
    this.unsubscribe();
  }

  refresh(): void {
    this.render();
  }

  private render(): void {
    const t = (k: TranslationKey): string => this.languageService.translate(k);
    const entries = this.getHistoryUseCase.execute();

    const body =
      entries.length === 0
        ? `<p class="entry-list__empty">${t('history_empty')}</p>`
        : `<ul class="entry-list">${entries
            .map(
              (e) => `
                <li class="entry-list__item entry-list__item--triple">
                  <span>${e.fromValue} ${e.fromUnit}</span>
                  <span aria-hidden="true">→</span>
                  <span>${e.toValue} ${e.toUnit}</span>
                </li>
              `,
            )
            .join('')}</ul>`;

    this.root.innerHTML = `
      <header class="entry-list__header">
        <h2 class="entry-list__title">${t('nav_history')}</h2>
        <button type="button" class="btn btn--ghost btn--small" data-action="clear">
          ${t('common_clear')}
        </button>
      </header>
      ${body}
    `;

    this.root
      .querySelector<HTMLButtonElement>('[data-action="clear"]')
      ?.addEventListener('click', () => {
        this.clearHistoryUseCase.execute();
        this.render();
      });
  }
}
