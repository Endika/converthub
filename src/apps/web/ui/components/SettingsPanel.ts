import {
  RATE_PROVIDERS,
  type RateProvider,
} from '../../../../contexts/exchange-rate/domain/model/RateProvider';
import type { RateProviderPreferencePort } from '../../../../contexts/exchange-rate/domain/ports/out/RateProviderPreferencePort';
import type { LanguageService } from '../../../../contexts/language/domain/services/LanguageService';
import type { TranslationKey } from '../../../../contexts/language/domain/translations/Translations';

const PROVIDER_LABEL_KEY: Record<RateProvider, TranslationKey> = {
  'exchangerate-api': 'settings_provider_exchangerate_api',
  frankfurter: 'settings_provider_frankfurter',
  'open-er-api': 'settings_provider_open_er_api',
  fawazahmed: 'settings_provider_fawazahmed',
};

export interface SettingsPanelCallbacks {
  onProviderChange?: (provider: RateProvider) => void;
}

export class SettingsPanel {
  private readonly unsubscribe: () => void;

  constructor(
    private readonly root: HTMLElement,
    private readonly languageService: LanguageService,
    private readonly preference: RateProviderPreferencePort,
    private readonly callbacks: SettingsPanelCallbacks = {},
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
    const current = this.preference.get();
    const options = RATE_PROVIDERS.map(
      (p) => `
        <label class="settings__option">
          <input
            type="radio"
            name="rate-provider"
            value="${p}"
            ${p === current ? 'checked' : ''}
          />
          <span>${t(PROVIDER_LABEL_KEY[p])}</span>
        </label>
      `,
    ).join('');

    this.root.innerHTML = `
      <section class="settings">
        <h2 class="settings__title">${t('settings_provider_title')}</h2>
        <p class="settings__description">${t('settings_provider_description')}</p>
        <div class="settings__options">${options}</div>
      </section>
    `;

    this.root
      .querySelectorAll<HTMLInputElement>('input[name="rate-provider"]')
      .forEach((input) => {
        input.addEventListener('change', () => {
          if (!input.checked) return;
          const next = input.value as RateProvider;
          if (next === current) return;
          this.preference.set(next);
          this.callbacks.onProviderChange?.(next);
        });
      });
  }
}
