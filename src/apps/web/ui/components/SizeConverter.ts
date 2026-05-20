import type { ConvertSizeUseCase } from '../../../../contexts/conversion/application/ConvertSizeUseCase';
import {
  SIZE_CATEGORIES,
  SIZE_REGIONS,
  SIZE_TABLES,
  type SizeCategory,
  type SizeRegion,
} from '../../../../contexts/conversion/domain/model/catalogs/sizes';
import type { AddToHistoryUseCase } from '../../../../contexts/history/application/AddToHistoryUseCase';
import { ConversionEntry } from '../../../../contexts/history/domain/model/ConversionEntry';
import type { LanguageService } from '../../../../contexts/language/domain/services/LanguageService';
import type { TranslationKey } from '../../../../contexts/language/domain/translations/Translations';
import { isOk } from '../../../../shared-kernel/domain/Result';

const CATEGORY_LABELS: Record<SizeCategory, TranslationKey> = {
  shoes_men: 'size_shoes_men',
  shoes_women: 'size_shoes_women',
  clothing_men: 'size_clothing_men',
  clothing_women: 'size_clothing_women',
};

const REGION_LABELS: Record<SizeRegion, TranslationKey> = {
  eu: 'region_eu',
  us: 'region_us',
  uk: 'region_uk',
};

export interface SizeConverterCallbacks {
  onHistoryChanged?: () => void;
}

export class SizeConverter {
  private categorySelect!: HTMLSelectElement;
  private fromRegionSelect!: HTMLSelectElement;
  private toRegionSelect!: HTMLSelectElement;
  private labelSelect!: HTMLSelectElement;
  private resultEl!: HTMLElement;
  private readonly unsubscribe: () => void;

  constructor(
    private readonly root: HTMLElement,
    private readonly languageService: LanguageService,
    private readonly useCase: ConvertSizeUseCase,
    private readonly addToHistoryUseCase: AddToHistoryUseCase,
    private readonly callbacks: SizeConverterCallbacks = {},
  ) {
    this.render();
    this.unsubscribe = this.languageService.onChange(() => this.render());
  }

  destroy(): void {
    this.unsubscribe();
  }

  private currentCategory(): SizeCategory {
    return (this.categorySelect?.value as SizeCategory) ?? 'shoes_men';
  }

  private currentFromRegion(): SizeRegion {
    return (this.fromRegionSelect?.value as SizeRegion) ?? 'eu';
  }

  private labelsForCategoryRegion(
    category: SizeCategory,
    region: SizeRegion,
  ): readonly string[] {
    return SIZE_TABLES[category].map((row) => row[region]);
  }

  private render(): void {
    const t = (k: TranslationKey): string => this.languageService.translate(k);
    const selectedCategory = this.currentCategory();
    const selectedFromRegion = this.currentFromRegion();
    const labels = this.labelsForCategoryRegion(
      selectedCategory,
      selectedFromRegion,
    );

    const categoryOptions = SIZE_CATEGORIES.map(
      (c) =>
        `<option value="${c}"${c === selectedCategory ? ' selected' : ''}>${t(CATEGORY_LABELS[c])}</option>`,
    ).join('');
    const regionOptions = (selected: SizeRegion): string =>
      SIZE_REGIONS.map(
        (r) =>
          `<option value="${r}"${r === selected ? ' selected' : ''}>${t(REGION_LABELS[r])}</option>`,
      ).join('');
    const labelOptions = labels
      .map((l) => `<option value="${l}">${l}</option>`)
      .join('');

    this.root.innerHTML = `
      <form class="converter" novalidate>
        <label class="field">
          <span class="field__label">${t('nav_sizes')}</span>
          <select name="category">${categoryOptions}</select>
        </label>
        <label class="field">
          <span class="field__label">${t('common_from')}</span>
          <select name="fromRegion">${regionOptions(selectedFromRegion)}</select>
        </label>
        <label class="field">
          <span class="field__label">${t('common_to')}</span>
          <select name="toRegion">${regionOptions('us')}</select>
        </label>
        <label class="field">
          <span class="field__label">${t('nav_sizes')}</span>
          <select name="label">${labelOptions}</select>
        </label>
        <button type="submit" class="btn btn--primary">${t('common_convert')}</button>
        <output class="converter__result" aria-live="polite"></output>
      </form>
    `;

    const form = this.root.querySelector('form') as HTMLFormElement;
    this.categorySelect = form.elements.namedItem(
      'category',
    ) as HTMLSelectElement;
    this.fromRegionSelect = form.elements.namedItem(
      'fromRegion',
    ) as HTMLSelectElement;
    this.toRegionSelect = form.elements.namedItem(
      'toRegion',
    ) as HTMLSelectElement;
    this.labelSelect = form.elements.namedItem('label') as HTMLSelectElement;
    this.resultEl = this.root.querySelector(
      '.converter__result',
    ) as HTMLElement;

    const refresh = (): void => this.render();
    this.categorySelect.addEventListener('change', refresh);
    this.fromRegionSelect.addEventListener('change', refresh);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.convert();
    });
  }

  private convert(): void {
    const result = this.useCase.execute(
      this.labelSelect.value,
      this.categorySelect.value,
      this.fromRegionSelect.value,
      this.toRegionSelect.value,
    );

    if (!isOk(result)) {
      this.resultEl.textContent = this.languageService.translate(
        'error_invalid_amount',
      );
      return;
    }

    const out = result.value;
    this.resultEl.textContent = `${this.labelSelect.value} (${this.fromRegionSelect.value.toUpperCase()}) = ${out.label} (${out.region.toUpperCase()})`;

    this.addToHistoryUseCase.execute(
      ConversionEntry.create({
        type: 'size',
        fromValue: this.labelSelect.value,
        fromUnit: `${this.categorySelect.value}/${this.fromRegionSelect.value}`,
        toValue: out.label,
        toUnit: `${this.categorySelect.value}/${this.toRegionSelect.value}`,
      }),
    );
    this.callbacks.onHistoryChanged?.();
  }
}
