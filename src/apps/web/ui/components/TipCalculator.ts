import type { CalculateTipUseCase } from '../../../../contexts/tipping/application/CalculateTipUseCase';
import { SUPPORTED_CURRENCIES } from '../../../../contexts/conversion/domain/model/catalogs/currencies';
import type { LanguageService } from '../../../../contexts/language/domain/services/LanguageService';
import type { TranslationKey } from '../../../../contexts/language/domain/translations/Translations';
import { defaultTipFor } from '../../../../contexts/tipping/domain/model/catalogs/currencyTipDefaults';
import type { TipInput } from '../../../../contexts/tipping/domain/model/TipCalculation';
import { isOk } from '../../../../shared-kernel/domain/Result';
import { formatAmount } from '../format';

const PRESET_PERCENTS = [0, 5, 10, 12, 15, 18, 20] as const;
const EMPTY_PLACEHOLDER = '—';

export class TipCalculator {
  private billInput!: HTMLInputElement;
  private billCurrencySelect!: HTMLSelectElement;
  private homeCurrencySelect!: HTMLSelectElement;
  private customPercentInput!: HTMLInputElement;
  private peopleInput!: HTMLInputElement;
  private roundUpInput!: HTMLInputElement;
  private percentButtons: HTMLButtonElement[] = [];
  private currentPercent = 0;
  private userTouchedPercent = false;
  private readonly unsubscribe: () => void;

  constructor(
    private readonly root: HTMLElement,
    private readonly languageService: LanguageService,
    private readonly useCase: CalculateTipUseCase,
  ) {
    this.render();
    this.unsubscribe = this.languageService.onChange(() => this.render());
  }

  destroy(): void {
    this.unsubscribe();
  }

  private render(): void {
    const t = (k: TranslationKey): string => this.languageService.translate(k);
    const currencyOptions = SUPPORTED_CURRENCIES.map(
      (c) => `<option value="${c}">${c}</option>`,
    ).join('');

    this.userTouchedPercent = false;

    this.root.innerHTML = `
      <form class="converter converter--tip" novalidate>
        <label class="field">
          <span class="field__label">${t('tip_bill')}</span>
          <input type="number" name="bill" inputmode="decimal" min="0" step="0.01" value="" />
        </label>
        <label class="field">
          <span class="field__label">${t('tip_bill_currency')}</span>
          <select name="billCurrency">${currencyOptions}</select>
        </label>
        <fieldset class="tip-percent">
          <legend class="field__label">${t('tip_percent')}</legend>
          <div class="tip-percent__row">
            ${PRESET_PERCENTS.map(
              (p) =>
                `<button type="button" class="tip-percent__btn" data-percent="${p}">${p}%</button>`,
            ).join('')}
            <input
              type="number"
              name="customPercent"
              class="tip-percent__custom"
              inputmode="decimal"
              min="0"
              step="0.5"
              placeholder="${t('tip_percent_custom')}"
            />
          </div>
        </fieldset>
        <label class="field">
          <span class="field__label">${t('tip_people')}</span>
          <input type="number" name="people" inputmode="numeric" min="1" step="1" value="1" />
        </label>
        <label class="field field--checkbox">
          <input type="checkbox" name="roundUp" />
          <span>${t('tip_round_up')}</span>
        </label>
        <label class="field">
          <span class="field__label">${t('tip_home_currency')}</span>
          <select name="homeCurrency">${currencyOptions}</select>
        </label>
        <div class="tip-result" aria-live="polite">
          <div class="tip-result__row" data-result="tip">
            <span class="tip-result__label">${t('tip_amount')}</span>
            <span class="tip-result__local" data-result-local="tip"></span>
            <span class="tip-result__home" data-result-home="tip"></span>
          </div>
          <div class="tip-result__row" data-result="total">
            <span class="tip-result__label">${t('tip_total')}</span>
            <span class="tip-result__local" data-result-local="total"></span>
            <span class="tip-result__home" data-result-home="total"></span>
          </div>
          <div class="tip-result__row" data-result="per-person">
            <span class="tip-result__label">${t('tip_per_person')}</span>
            <span class="tip-result__local" data-result-local="per-person"></span>
            <span class="tip-result__home" data-result-home="per-person"></span>
          </div>
          <p class="tip-result__hint" data-result="hint"></p>
        </div>
      </form>
    `;

    const form = this.root.querySelector('form') as HTMLFormElement;
    this.billInput = form.elements.namedItem('bill') as HTMLInputElement;
    this.billCurrencySelect = form.elements.namedItem(
      'billCurrency',
    ) as HTMLSelectElement;
    this.homeCurrencySelect = form.elements.namedItem(
      'homeCurrency',
    ) as HTMLSelectElement;
    this.customPercentInput = form.elements.namedItem(
      'customPercent',
    ) as HTMLInputElement;
    this.peopleInput = form.elements.namedItem('people') as HTMLInputElement;
    this.roundUpInput = form.elements.namedItem('roundUp') as HTMLInputElement;
    this.percentButtons = Array.from(
      form.querySelectorAll<HTMLButtonElement>('[data-percent]'),
    );

    this.billCurrencySelect.value = 'EUR';
    this.homeCurrencySelect.value = 'USD';
    this.applyDefaultPercentForCurrency();
    this.updatePresetActiveState();

    this.billInput.addEventListener('input', () => this.refreshResult());
    this.peopleInput.addEventListener('input', () => this.refreshResult());
    this.roundUpInput.addEventListener('change', () => this.refreshResult());
    this.billCurrencySelect.addEventListener('change', () => {
      this.applyDefaultPercentForCurrency();
      this.updatePresetActiveState();
      this.refreshResult();
    });
    this.homeCurrencySelect.addEventListener('change', () =>
      this.refreshResult(),
    );
    this.percentButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const raw = btn.dataset['percent'];
        if (raw === undefined) return;
        const value = Number(raw);
        if (Number.isFinite(value)) {
          this.setPercent(value, true);
        }
      });
    });
    this.customPercentInput.addEventListener('input', () => {
      const value = Number(this.customPercentInput.value);
      if (Number.isFinite(value) && value >= 0) {
        this.setPercent(value, true);
      }
    });

    this.refreshResult();
  }

  private applyDefaultPercentForCurrency(): void {
    if (this.userTouchedPercent) return;
    this.currentPercent = defaultTipFor(this.billCurrencySelect.value);
  }

  private setPercent(value: number, fromUser: boolean): void {
    this.currentPercent = value;
    if (fromUser) this.userTouchedPercent = true;
    this.updatePresetActiveState();
    this.refreshResult();
  }

  private updatePresetActiveState(): void {
    this.percentButtons.forEach((btn) => {
      const raw = btn.dataset['percent'];
      const isActive = raw !== undefined && Number(raw) === this.currentPercent;
      btn.classList.toggle('is-active', isActive);
    });
  }

  private buildInput(): TipInput | null {
    const bill = Number(this.billInput.value);
    if (!Number.isFinite(bill) || bill <= 0) return null;
    const splitBetween = Math.max(
      1,
      Math.floor(Number(this.peopleInput.value)),
    );
    return {
      bill,
      billCurrency: this.billCurrencySelect.value,
      homeCurrency: this.homeCurrencySelect.value,
      tipPercent: this.currentPercent,
      splitBetween,
      roundUp: this.roundUpInput.checked,
    };
  }

  private refreshResult(): void {
    const input = this.buildInput();
    if (input === null) {
      this.writeResultRow('tip', null, null);
      this.writeResultRow('total', null, null);
      this.writeResultRow('per-person', null, null);
      this.setHint('');
      return;
    }
    const result = this.useCase.execute(input);
    if (!isOk(result)) {
      this.setHint('');
      return;
    }
    const value = result.value;
    this.writeResultRow('tip', value.tipAmount, value.tipAmountHome);
    this.writeResultRow('total', value.total, value.totalHome);
    this.writeResultRow(
      'per-person',
      value.perPersonTotal,
      value.perPersonTotalHome,
    );
    this.setHint(
      value.totalHome === null
        ? this.languageService.translate('tip_no_rate')
        : '',
    );
  }

  private writeResultRow(
    key: 'tip' | 'total' | 'per-person',
    local: number | null,
    home: number | null,
  ): void {
    const localEl = this.root.querySelector<HTMLElement>(
      `[data-result-local="${key}"]`,
    );
    const homeEl = this.root.querySelector<HTMLElement>(
      `[data-result-home="${key}"]`,
    );
    if (localEl !== null) {
      localEl.textContent =
        local === null
          ? ''
          : `${formatAmount(local)} ${this.billCurrencySelect.value}`;
    }
    if (homeEl !== null) {
      homeEl.textContent =
        home === null
          ? EMPTY_PLACEHOLDER
          : `${formatAmount(home)} ${this.homeCurrencySelect.value}`;
    }
  }

  private setHint(text: string): void {
    const hint = this.root.querySelector<HTMLElement>('[data-result="hint"]');
    if (hint !== null) hint.textContent = text;
  }
}
