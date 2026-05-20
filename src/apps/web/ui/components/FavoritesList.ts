import type { ConvertMoneyUseCase } from '../../../../contexts/conversion/application/ConvertMoneyUseCase';
import type { GetFavoritesUseCase } from '../../../../contexts/favorites/application/GetFavoritesUseCase';
import type { RemoveFavoriteUseCase } from '../../../../contexts/favorites/application/RemoveFavoriteUseCase';
import type { Favorite } from '../../../../contexts/favorites/domain/model/Favorite';
import type { LanguageService } from '../../../../contexts/language/domain/services/LanguageService';
import type { TranslationKey } from '../../../../contexts/language/domain/translations/Translations';
import { isOk } from '../../../../shared-kernel/domain/Result';
import { formatAmount } from '../format';

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export interface FavoritesListCallbacks {
  onApply?: (favorite: Favorite) => void;
}

export class FavoritesList {
  private readonly unsubscribe: () => void;

  constructor(
    private readonly root: HTMLElement,
    private readonly languageService: LanguageService,
    private readonly getFavoritesUseCase: GetFavoritesUseCase,
    private readonly removeFavoriteUseCase: RemoveFavoriteUseCase,
    private readonly convertMoneyUseCase: ConvertMoneyUseCase,
    private readonly callbacks: FavoritesListCallbacks = {},
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

  private liveResultLabel(favorite: Favorite): string {
    if (favorite.type !== 'money' || favorite.amount === null) {
      return favorite.type;
    }
    const result = this.convertMoneyUseCase.execute(
      favorite.amount,
      favorite.fromUnit,
      favorite.toUnit,
    );
    if (!isOk(result)) return favorite.type;
    return `≈ ${formatAmount(result.value.amount)} ${favorite.toUnit}`;
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
                <li class="entry-list__item entry-list__item--clickable" data-id="${escapeHtml(f.id)}">
                  <button type="button" class="entry-list__action" data-action="apply" aria-label="${escapeHtml(f.label)}">
                    <span class="entry-list__primary">${escapeHtml(f.label)}</span>
                    <span class="entry-list__secondary">${escapeHtml(this.liveResultLabel(f))}</span>
                  </button>
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

    const itemsById = new Map(items.map((f) => [f.id, f]));

    this.root
      .querySelectorAll<HTMLButtonElement>('[data-action="apply"]')
      .forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = btn.closest<HTMLElement>('[data-id]')?.dataset['id'];
          if (id === undefined) return;
          const favorite = itemsById.get(id);
          if (favorite === undefined) return;
          this.callbacks.onApply?.(favorite);
        });
      });

    this.root
      .querySelectorAll<HTMLButtonElement>('[data-action="remove"]')
      .forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = btn.closest<HTMLElement>('[data-id]')?.dataset['id'];
          if (id === undefined) return;
          this.removeFavoriteUseCase.execute(id);
          this.render();
        });
      });
  }
}
