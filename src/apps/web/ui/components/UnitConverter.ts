import type { AddToHistoryUseCase } from '../../../../contexts/history/application/AddToHistoryUseCase';
import {
  ConversionEntry,
  type ConversionType,
} from '../../../../contexts/history/domain/model/ConversionEntry';
import type { LanguageService } from '../../../../contexts/language/domain/services/LanguageService';
import type { TranslationKey } from '../../../../contexts/language/domain/translations/Translations';
import { isOk, type Result } from '../../../../shared-kernel/domain/Result';
import { formatAmount } from '../format';

export interface UnitConversionOutput {
  readonly value: number;
  readonly unit: string;
}

export interface UnitConvertUseCase {
  execute(
    value: number,
    from: string,
    to: string,
  ): Result<UnitConversionOutput, Error>;
}

export interface UnitConverterConfig {
  readonly type: Exclude<ConversionType, 'money' | 'size'>;
  readonly units: readonly string[];
  readonly defaultFrom: string;
  readonly defaultTo: string;
  readonly acceptsNegative: boolean;
  readonly unitLabels?: Readonly<Record<string, string>>;
}

export interface UnitConverterCallbacks {
  onHistoryChanged?: () => void;
}

export class UnitConverter {
  private amountInput!: HTMLInputElement;
  private fromSelect!: HTMLSelectElement;
  private toSelect!: HTMLSelectElement;
  private resultEl!: HTMLElement;
  private readonly unsubscribe: () => void;

  constructor(
    private readonly root: HTMLElement,
    private readonly languageService: LanguageService,
    private readonly useCase: UnitConvertUseCase,
    private readonly addToHistoryUseCase: AddToHistoryUseCase,
    private readonly config: UnitConverterConfig,
    private readonly callbacks: UnitConverterCallbacks = {},
  ) {
    this.render();
    this.unsubscribe = this.languageService.onChange(() => this.render());
  }

  destroy(): void {
    this.unsubscribe();
  }

  private displayLabel(unit: string): string {
    return this.config.unitLabels?.[unit] ?? unit;
  }

  private render(): void {
    const t = (k: TranslationKey): string => this.languageService.translate(k);
    const options = this.config.units
      .map((u) => `<option value="${u}">${this.displayLabel(u)}</option>`)
      .join('');
    const minAttr = this.config.acceptsNegative ? '' : 'min="0"';

    this.root.innerHTML = `
      <form class="converter" novalidate>
        <label class="field">
          <span class="field__label">${t('common_from')}</span>
          <input type="number" name="amount" inputmode="decimal" value="1" step="0.01" ${minAttr} />
        </label>
        <label class="field">
          <span class="field__label">${t('common_from')}</span>
          <select name="from">${options}</select>
        </label>
        <label class="field">
          <span class="field__label">${t('common_to')}</span>
          <select name="to">${options}</select>
        </label>
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
      </form>
    `;

    const form = this.root.querySelector('form') as HTMLFormElement;
    this.amountInput = form.elements.namedItem('amount') as HTMLInputElement;
    this.fromSelect = form.elements.namedItem('from') as HTMLSelectElement;
    this.toSelect = form.elements.namedItem('to') as HTMLSelectElement;
    this.resultEl = this.root.querySelector(
      '.converter__result',
    ) as HTMLElement;
    this.fromSelect.value = this.config.defaultFrom;
    this.toSelect.value = this.config.defaultTo;

    this.root
      .querySelector<HTMLButtonElement>('[data-action="swap"]')
      ?.addEventListener('click', () => {
        const from = this.fromSelect.value;
        this.fromSelect.value = this.toSelect.value;
        this.toSelect.value = from;
      });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.convert();
    });
  }

  setPair(from: string, to: string, amount?: number | null): void {
    const exists = (sel: HTMLSelectElement, v: string): boolean =>
      Array.from(sel.options).some((o) => o.value === v);
    if (exists(this.fromSelect, from)) this.fromSelect.value = from;
    if (exists(this.toSelect, to)) this.toSelect.value = to;
    if (amount !== undefined && amount !== null && Number.isFinite(amount)) {
      this.amountInput.value = formatAmount(amount);
    }
  }

  private convert(): void {
    const amount = Number(this.amountInput.value);
    const result = this.useCase.execute(
      amount,
      this.fromSelect.value,
      this.toSelect.value,
    );

    if (!isOk(result)) {
      this.resultEl.textContent = this.languageService.translate(
        'error_invalid_amount',
      );
      return;
    }

    const amountDisplay = formatAmount(amount);
    const value = formatAmount(result.value.value);
    const fromLabel = this.displayLabel(this.fromSelect.value);
    const toLabel = this.displayLabel(this.toSelect.value);
    this.resultEl.textContent = `${amountDisplay} ${fromLabel} = ${value} ${toLabel}`;

    this.addToHistoryUseCase.execute(
      ConversionEntry.create({
        type: this.config.type,
        fromValue: amountDisplay,
        fromUnit: this.fromSelect.value,
        toValue: value,
        toUnit: this.toSelect.value,
      }),
    );
    this.callbacks.onHistoryChanged?.();
  }
}
