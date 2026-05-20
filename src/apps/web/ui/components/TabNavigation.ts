import type { LanguageService } from '../../../../contexts/language/domain/services/LanguageService';
import type { TranslationKey } from '../../../../contexts/language/domain/translations/Translations';

export interface TabDefinition<TKey extends string> {
  readonly key: TKey;
  readonly labelKey: TranslationKey;
}

export interface TabNavigationCallbacks<TKey extends string> {
  onChange: (key: TKey) => void;
}

export class TabNavigation<TKey extends string> {
  private active: TKey;
  private readonly unsubscribe: () => void;

  constructor(
    private readonly root: HTMLElement,
    private readonly languageService: LanguageService,
    private readonly tabs: readonly TabDefinition<TKey>[],
    private readonly callbacks: TabNavigationCallbacks<TKey>,
    initial: TKey,
  ) {
    this.active = initial;
    this.render();
    this.unsubscribe = this.languageService.onChange(() => this.render());
  }

  destroy(): void {
    this.unsubscribe();
  }

  private render(): void {
    const t = (k: TranslationKey): string => this.languageService.translate(k);
    this.root.innerHTML = this.tabs
      .map(
        (tab) => `
          <button
            type="button"
            class="tab${tab.key === this.active ? ' is-active' : ''}"
            data-tab="${tab.key}"
            aria-pressed="${tab.key === this.active ? 'true' : 'false'}"
          >${t(tab.labelKey)}</button>
        `,
      )
      .join('');
    this.attach();
  }

  private attach(): void {
    this.root
      .querySelectorAll<HTMLButtonElement>('[data-tab]')
      .forEach((btn) => {
        btn.addEventListener('click', () => {
          const key = btn.dataset['tab'] as TKey | undefined;
          if (key === undefined || key === this.active) return;
          this.active = key;
          this.render();
          this.callbacks.onChange(key);
        });
      });
  }
}
