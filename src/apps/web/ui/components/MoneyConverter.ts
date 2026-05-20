import type { ConvertMoneyUseCase } from '../../../../contexts/conversion/application/ConvertMoneyUseCase';
import { RateNotAvailableError } from '../../../../contexts/conversion/domain/errors/RateNotAvailableError';
import { SUPPORTED_CURRENCIES } from '../../../../contexts/conversion/domain/model/catalogs/currencies';
import type { UpdateExchangeRatesUseCase } from '../../../../contexts/exchange-rate/application/UpdateExchangeRatesUseCase';
import type { AddFavoriteUseCase } from '../../../../contexts/favorites/application/AddFavoriteUseCase';
import { Favorite } from '../../../../contexts/favorites/domain/model/Favorite';
import type { AddToHistoryUseCase } from '../../../../contexts/history/application/AddToHistoryUseCase';
import { ConversionEntry } from '../../../../contexts/history/domain/model/ConversionEntry';
import type { LanguageService } from '../../../../contexts/language/domain/services/LanguageService';
import type { TranslationKey } from '../../../../contexts/language/domain/translations/Translations';
import type { GetPinnedCurrenciesUseCase } from '../../../../contexts/pinned-currencies/application/GetPinnedCurrenciesUseCase';
import type { PinCurrencyUseCase } from '../../../../contexts/pinned-currencies/application/PinCurrencyUseCase';
import type { UnpinCurrencyUseCase } from '../../../../contexts/pinned-currencies/application/UnpinCurrencyUseCase';
import { isErr, isOk } from '../../../../shared-kernel/domain/Result';
import { formatAmount } from '../format';

export interface MoneyConverterDeps {
  convertMoney: ConvertMoneyUseCase;
  addToHistory: AddToHistoryUseCase;
  addFavorite: AddFavoriteUseCase;
  updateRates: UpdateExchangeRatesUseCase;
  getLastUpdatedAt: () => Date | null;
  pinCurrency: PinCurrencyUseCase;
  unpinCurrency: UnpinCurrencyUseCase;
  getPinnedCurrencies: GetPinnedCurrenciesUseCase;
}

export interface MoneyConverterCallbacks {
  onHistoryChanged?: () => void;
  onFavoriteSaved?: () => void;
}

type RatesStatus = 'fresh' | 'offline';

export class MoneyConverter {
  private amountInput!: HTMLInputElement;
  private fromSelect!: HTMLSelectElement;
  private toSelect!: HTMLSelectElement;
  private fromHint!: HTMLElement;
  private toHint!: HTMLElement;
  private fromPinBtn!: HTMLButtonElement;
  private toPinBtn!: HTMLButtonElement;
  private resultEl!: HTMLElement;
  private statusEl!: HTMLElement;
  private refreshButton!: HTMLButtonElement;
  private displayNames: Intl.DisplayNames | null = null;
  private ratesStatus: RatesStatus = 'fresh';
  private readonly unsubscribe: () => void;

  constructor(
    private readonly root: HTMLElement,
    private readonly languageService: LanguageService,
    private readonly deps: MoneyConverterDeps,
    private readonly callbacks: MoneyConverterCallbacks = {},
  ) {
    this.render();
    this.unsubscribe = this.languageService.onChange(() => this.render());
  }

  destroy(): void {
    this.unsubscribe();
  }

  setPair(from: string, to: string, amount?: number | null): void {
    const optionExists = (sel: HTMLSelectElement, value: string): boolean =>
      Array.from(sel.options).some((o) => o.value === value);
    if (optionExists(this.fromSelect, from)) this.fromSelect.value = from;
    if (optionExists(this.toSelect, to)) this.toSelect.value = to;
    if (amount !== undefined && amount !== null && Number.isFinite(amount)) {
      this.amountInput.value = formatAmount(amount);
    }
    this.refreshHints();
    this.refreshPinButtons();
  }

  private buildDisplayNames(): Intl.DisplayNames | null {
    try {
      return new Intl.DisplayNames([this.languageService.getCurrent().value], {
        type: 'currency',
      });
    } catch {
      return null;
    }
  }

  private currencyName(code: string): string {
    const name = this.displayNames?.of(code);
    return name !== undefined && name !== code ? name : code;
  }

  private optionLabel(code: string): string {
    const name = this.displayNames?.of(code);
    return name !== undefined && name !== code ? `${code} — ${name}` : code;
  }

  private buildOptionsHtml(t: (k: TranslationKey) => string): string {
    const pinned = this.deps.getPinnedCurrencies.execute().map((p) => p.code);
    const pinnedSet = new Set(pinned);
    const rest = SUPPORTED_CURRENCIES.filter((c) => !pinnedSet.has(c));

    const pinnedHtml = pinned
      .map((c) => `<option value="${c}">★ ${this.optionLabel(c)}</option>`)
      .join('');
    const restHtml = rest
      .map((c) => `<option value="${c}">${this.optionLabel(c)}</option>`)
      .join('');

    if (pinnedHtml === '') {
      return restHtml;
    }
    return `
      <optgroup label="${t('currencies_pinned')}">${pinnedHtml}</optgroup>
      <optgroup label="${t('currencies_all')}">${restHtml}</optgroup>
    `;
  }

  private formatTimestamp(date: Date): string {
    return new Intl.DateTimeFormat(this.languageService.getCurrent().value, {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(date);
  }

  private render(): void {
    const t = (k: TranslationKey): string => this.languageService.translate(k);
    this.displayNames = this.buildDisplayNames();
    const optionsHtml = this.buildOptionsHtml(t);

    this.root.innerHTML = `
      <form class="converter converter--money" novalidate>
        <label class="field field--amount">
          <span class="field__label">${t('common_from')}</span>
          <input type="number" name="amount" inputmode="decimal" value="1" min="0" step="0.01" />
        </label>
        <div class="field field--currency">
          <span class="field__label">${t('common_from')}</span>
          <div class="field__row">
            <select name="from">${optionsHtml}</select>
            <button type="button" class="pin-button" data-pin="from" aria-label="${t('pin_add')}">★</button>
          </div>
          <span class="field__hint" data-hint="from"></span>
        </div>
        <div class="field field--currency">
          <span class="field__label">${t('common_to')}</span>
          <div class="field__row">
            <select name="to">${optionsHtml}</select>
            <button type="button" class="pin-button" data-pin="to" aria-label="${t('pin_add')}">★</button>
          </div>
          <span class="field__hint" data-hint="to"></span>
        </div>
        <div class="converter__actions">
          <button
            type="button"
            class="btn btn--ghost btn--icon"
            data-action="swap"
            aria-label="${t('common_swap')}"
            title="${t('common_swap')}"
          >⇄</button>
          <button type="submit" class="btn btn--primary btn--cta">${t('common_convert')}</button>
        </div>
        <output class="converter__result" aria-live="polite"></output>
        <button
          type="button"
          class="btn btn--ghost btn--small converter__save-favorite"
          data-action="save-favorite"
          hidden
        >★ ${t('save_favorite')}</button>
        <div class="rates-status" data-region="rates-status">
          <span class="rates-status__label" data-region="rates-label"></span>
          <button type="button" class="rates-status__refresh" data-action="refresh">
            ${t('rates_refresh')}
          </button>
        </div>
      </form>
    `;

    const form = this.root.querySelector('form') as HTMLFormElement;
    this.amountInput = form.elements.namedItem('amount') as HTMLInputElement;
    this.fromSelect = form.elements.namedItem('from') as HTMLSelectElement;
    this.toSelect = form.elements.namedItem('to') as HTMLSelectElement;
    this.fromHint = this.root.querySelector(
      '[data-hint="from"]',
    ) as HTMLElement;
    this.toHint = this.root.querySelector('[data-hint="to"]') as HTMLElement;
    this.fromPinBtn = this.root.querySelector(
      '[data-pin="from"]',
    ) as HTMLButtonElement;
    this.toPinBtn = this.root.querySelector(
      '[data-pin="to"]',
    ) as HTMLButtonElement;
    this.resultEl = this.root.querySelector(
      '.converter__result',
    ) as HTMLElement;
    this.statusEl = this.root.querySelector(
      '[data-region="rates-label"]',
    ) as HTMLElement;
    this.refreshButton = this.root.querySelector(
      '[data-action="refresh"]',
    ) as HTMLButtonElement;
    this.fromSelect.value = 'USD';
    this.toSelect.value = 'EUR';
    this.refreshHints();
    this.refreshPinButtons();
    this.renderStatus();

    this.fromSelect.addEventListener('change', () => {
      this.refreshHints();
      this.refreshPinButtons();
    });
    this.toSelect.addEventListener('change', () => {
      this.refreshHints();
      this.refreshPinButtons();
    });
    this.fromPinBtn.addEventListener('click', () =>
      this.togglePin(this.fromSelect.value),
    );
    this.toPinBtn.addEventListener('click', () =>
      this.togglePin(this.toSelect.value),
    );
    this.refreshButton.addEventListener('click', () => {
      void this.refreshRates();
    });
    this.root
      .querySelector<HTMLButtonElement>('[data-action="swap"]')
      ?.addEventListener('click', () => this.swap());
    this.root
      .querySelector<HTMLButtonElement>('[data-action="save-favorite"]')
      ?.addEventListener('click', () => this.saveAsFavorite());
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.convert();
    });
  }

  private swap(): void {
    const from = this.fromSelect.value;
    const to = this.toSelect.value;
    this.fromSelect.value = to;
    this.toSelect.value = from;
    this.refreshHints();
    this.refreshPinButtons();
  }

  private refreshHints(): void {
    this.fromHint.textContent = this.currencyName(this.fromSelect.value);
    this.toHint.textContent = this.currencyName(this.toSelect.value);
  }

  private refreshPinButtons(): void {
    const t = (k: TranslationKey): string => this.languageService.translate(k);
    const pinned = new Set(
      this.deps.getPinnedCurrencies.execute().map((p) => p.code),
    );
    const apply = (btn: HTMLButtonElement, code: string): void => {
      const isPinned = pinned.has(code);
      btn.classList.toggle('is-pinned', isPinned);
      btn.setAttribute('aria-pressed', isPinned ? 'true' : 'false');
      btn.setAttribute('aria-label', isPinned ? t('pin_remove') : t('pin_add'));
      btn.title = isPinned ? t('pin_remove') : t('pin_add');
    };
    apply(this.fromPinBtn, this.fromSelect.value);
    apply(this.toPinBtn, this.toSelect.value);
  }

  private togglePin(code: string): void {
    const pinned = this.deps.getPinnedCurrencies
      .execute()
      .some((p) => p.code === code);
    if (pinned) {
      this.deps.unpinCurrency.execute(code);
    } else {
      const result = this.deps.pinCurrency.execute(code);
      if (isErr(result)) {
        this.resultEl.textContent = this.languageService.translate('pin_full');
        return;
      }
    }
    const fromValue = this.fromSelect.value;
    const toValue = this.toSelect.value;
    this.render();
    this.fromSelect.value = fromValue;
    this.toSelect.value = toValue;
    this.refreshHints();
    this.refreshPinButtons();
  }

  private renderStatus(): void {
    const t = (k: TranslationKey): string => this.languageService.translate(k);
    const last = this.deps.getLastUpdatedAt();
    const container = this.root.querySelector('[data-region="rates-status"]');
    container?.classList.toggle(
      'rates-status--offline',
      this.ratesStatus === 'offline',
    );

    if (last === null) {
      this.statusEl.textContent = t('rates_unknown');
      return;
    }
    const prefix =
      this.ratesStatus === 'offline'
        ? t('offline_notice')
        : t('rates_updated_at');
    this.statusEl.textContent = `${prefix} ${this.formatTimestamp(last)}`;
  }

  private async refreshRates(): Promise<void> {
    const t = (k: TranslationKey): string => this.languageService.translate(k);
    this.refreshButton.disabled = true;
    this.statusEl.textContent = t('rates_refreshing');
    const result = await this.deps.updateRates.execute();
    this.ratesStatus = isOk(result) ? 'fresh' : 'offline';
    this.refreshButton.disabled = false;
    this.renderStatus();
  }

  private describeError(error: Error): string {
    const t = (k: TranslationKey): string => this.languageService.translate(k);
    if (error instanceof RateNotAvailableError) {
      return t('error_rate_not_available');
    }
    if (error.name === 'InvalidCurrencyError')
      return t('error_invalid_currency');
    return t('error_invalid_amount');
  }

  private convert(): void {
    const amount = Number(this.amountInput.value);
    const result = this.deps.convertMoney.execute(
      amount,
      this.fromSelect.value,
      this.toSelect.value,
    );

    if (isErr(result)) {
      this.resultEl.textContent = this.describeError(result.error);
      this.toggleSaveFavorite(false);
      return;
    }

    const amountDisplay = formatAmount(amount);
    const converted = formatAmount(result.value.amount);
    this.resultEl.textContent = `${amountDisplay} ${this.fromSelect.value} = ${converted} ${this.toSelect.value}`;
    this.toggleSaveFavorite(true);

    this.deps.addToHistory.execute(
      ConversionEntry.create({
        type: 'money',
        fromValue: amountDisplay,
        fromUnit: this.fromSelect.value,
        toValue: converted,
        toUnit: this.toSelect.value,
      }),
    );
    this.callbacks.onHistoryChanged?.();
  }

  private toggleSaveFavorite(visible: boolean): void {
    const btn = this.root.querySelector<HTMLButtonElement>(
      '[data-action="save-favorite"]',
    );
    if (btn !== null) btn.hidden = !visible;
  }

  private saveAsFavorite(): void {
    const from = this.fromSelect.value;
    const to = this.toSelect.value;
    const parsed = Number(this.amountInput.value);
    const amount = Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    const label =
      amount === null
        ? `${from} → ${to}`
        : `${formatAmount(amount)} ${from} → ${to}`;
    const result = this.deps.addFavorite.execute(
      Favorite.create({
        type: 'money',
        fromUnit: from,
        toUnit: to,
        label,
        amount,
      }),
    );
    if (isErr(result)) {
      this.resultEl.textContent = this.languageService.translate('pin_full');
      return;
    }
    this.callbacks.onFavoriteSaved?.();
  }
}
