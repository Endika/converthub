import type { GetFavoritesUseCase } from '../../../../contexts/favorites/application/GetFavoritesUseCase';
import type { RemoveFavoriteUseCase } from '../../../../contexts/favorites/application/RemoveFavoriteUseCase';
import type { LanguageService } from '../../../../contexts/language/domain/services/LanguageService';
import type { TranslationKey } from '../../../../contexts/language/domain/translations/Translations';

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export class FavoritesList {
  private readonly unsubscribe: () => void;

  constructor(
    private readonly root: HTMLElement,
    private readonly languageService: LanguageService,
    private readonly getFavoritesUseCase: GetFavoritesUseCase,
    private readonly removeFavoriteUseCase: RemoveFavoriteUseCase,
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
    const items = this.getFavoritesUseCase.execute();

    const body =
      items.length === 0
        ? `<p class="entry-list__empty">${t('favorites_empty')}</p>`
        : `<ul class="entry-list">${items
            .map(
              (f) => `
                <li class="entry-list__item" data-id="${escapeHtml(f.id)}">
                  <span class="entry-list__primary">${escapeHtml(f.label)}</span>
                  <span class="entry-list__secondary">${escapeHtml(f.type)}</span>
                  <button type="button" class="btn btn--ghost btn--icon" data-action="remove" aria-label="${t('common_delete')}">
                    ×
                  </button>
                </li>
              `,
            )
            .join('')}</ul>`;

    this.root.innerHTML = `
      <h2 class="entry-list__title">${t('nav_favorites')}</h2>
      ${body}
    `;

    this.root
      .querySelectorAll<HTMLButtonElement>('[data-action="remove"]')
      .forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.closest<HTMLElement>('[data-id]')?.dataset['id'];
          if (id === undefined) return;
          this.removeFavoriteUseCase.execute(id);
          this.render();
        });
      });
  }
}
