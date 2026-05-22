import type { LanguageService } from '../../../../contexts/language/domain/services/LanguageService';
import type { TranslationKey } from '../../../../contexts/language/domain/translations/Translations';

export type SidePanelKey = 'history' | 'favorites' | 'notes' | 'settings';

export interface SidePanelTab {
  readonly key: SidePanelKey;
  readonly labelKey: TranslationKey;
}

const TABS: readonly SidePanelTab[] = [
  { key: 'history', labelKey: 'nav_history' },
  { key: 'favorites', labelKey: 'nav_favorites' },
  { key: 'notes', labelKey: 'nav_notes' },
  { key: 'settings', labelKey: 'nav_settings' },
];

export interface SidePanelCallbacks {
  onChange: (key: SidePanelKey) => void;
}

export class SidePanel {
  private active: SidePanelKey;
  private readonly unsubscribe: () => void;

  constructor(
    private readonly root: HTMLElement,
    private readonly languageService: LanguageService,
    private readonly callbacks: SidePanelCallbacks,
    initial: SidePanelKey = 'history',
  ) {
    this.active = initial;
    this.render();
    this.unsubscribe = this.languageService.onChange(() => this.render());
  }

  destroy(): void {
    this.unsubscribe();
  }

  contentRegion(): HTMLElement {
    const region = this.root.querySelector<HTMLElement>(
      '[data-region="content"]',
    );
    if (region === null) {
      throw new Error('SidePanel content region missing');
    }
    return region;
  }

  private render(): void {
    const t = (k: TranslationKey): string => this.languageService.translate(k);
    const tabsHtml = TABS.map(
      (tab) => `
        <button
          type="button"
          class="side-panel__tab${tab.key === this.active ? ' is-active' : ''}"
          data-side-tab="${tab.key}"
          aria-pressed="${tab.key === this.active ? 'true' : 'false'}"
        >${t(tab.labelKey)}</button>
      `,
    ).join('');

    this.root.innerHTML = `
      <nav class="side-panel__tabs">${tabsHtml}</nav>
      <div class="side-panel__content" data-region="content"></div>
    `;

    this.root
      .querySelectorAll<HTMLButtonElement>('[data-side-tab]')
      .forEach((btn) => {
        btn.addEventListener('click', () => {
          const key = btn.dataset['sideTab'] as SidePanelKey | undefined;
          if (key === undefined || key === this.active) return;
          this.active = key;
          this.render();
          this.callbacks.onChange(key);
        });
      });
  }
}
