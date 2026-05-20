import type { ClearHistoryUseCase } from '../../../../contexts/history/application/ClearHistoryUseCase';
import type { GetHistoryUseCase } from '../../../../contexts/history/application/GetHistoryUseCase';
import type { ConversionEntry } from '../../../../contexts/history/domain/model/ConversionEntry';
import type { LanguageService } from '../../../../contexts/language/domain/services/LanguageService';
import type { TranslationKey } from '../../../../contexts/language/domain/translations/Translations';

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export interface HistoryListCallbacks {
  onApply?: (entry: ConversionEntry) => void;
}

export class HistoryList {
  private readonly unsubscribe: () => void;

  constructor(
    private readonly root: HTMLElement,
    private readonly languageService: LanguageService,
    private readonly getHistoryUseCase: GetHistoryUseCase,
    private readonly clearHistoryUseCase: ClearHistoryUseCase,
    private readonly callbacks: HistoryListCallbacks = {},
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
                <li class="entry-list__item entry-list__item--clickable" data-id="${escapeHtml(e.id)}">
                  <button type="button" class="entry-list__action entry-list__action--triple" data-action="apply">
                    <span>${escapeHtml(e.fromValue)} ${escapeHtml(e.fromUnit)}</span>
                    <span aria-hidden="true">→</span>
                    <span>${escapeHtml(e.toValue)} ${escapeHtml(e.toUnit)}</span>
                  </button>
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

    const entriesById = new Map(entries.map((e) => [e.id, e]));

    this.root
      .querySelector<HTMLButtonElement>('[data-action="clear"]')
      ?.addEventListener('click', () => {
        this.clearHistoryUseCase.execute();
        this.render();
      });

    this.root
      .querySelectorAll<HTMLButtonElement>('[data-action="apply"]')
      .forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.closest<HTMLElement>('[data-id]')?.dataset['id'];
          if (id === undefined) return;
          const entry = entriesById.get(id);
          if (entry === undefined) return;
          this.callbacks.onApply?.(entry);
        });
      });
  }
}
