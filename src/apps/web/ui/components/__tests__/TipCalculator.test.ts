import { beforeEach, describe, expect, it } from 'vitest';
import { CalculateTipUseCase } from '../../../../../contexts/tipping/application/CalculateTipUseCase';
import { GetFavoritesUseCase } from '../../../../../contexts/favorites/application/GetFavoritesUseCase';
import { Favorite } from '../../../../../contexts/favorites/domain/model/Favorite';
import type { FavoritesRepositoryPort } from '../../../../../contexts/favorites/domain/ports/out/FavoritesRepositoryPort';
import { FavoritesService } from '../../../../../contexts/favorites/domain/services/FavoritesService';
import { LanguageCode } from '../../../../../contexts/language/domain/model/LanguageCode';
import { LanguageService } from '../../../../../contexts/language/domain/services/LanguageService';
import type { RateConverterPort } from '../../../../../contexts/tipping/domain/ports/out/RateConverterPort';
import { TipCalculator as TipCalculatorService } from '../../../../../contexts/tipping/domain/services/TipCalculator';
import { TipCalculator } from '../TipCalculator';

class StubRateConverter implements RateConverterPort {
  convert(amount: number, from: string, to: string): number | null {
    if (from === to) return amount;
    if (from === 'EUR' && to === 'USD') return amount * 1.1;
    return null;
  }
}

const buildFavoritesRepo = (
  initial: readonly Favorite[] = [],
): FavoritesRepositoryPort => {
  let state: Favorite[] = [...initial];
  return {
    loadAll: () => [...state],
    saveAll: (next) => {
      state = [...next];
    },
  };
};

const makeComponent = (
  favorites: readonly Favorite[] = [],
): { root: HTMLElement; component: TipCalculator } => {
  const root = document.createElement('section');
  document.body.appendChild(root);
  const language = new LanguageService(LanguageCode.fromTrusted('en'));
  const useCase = new CalculateTipUseCase(
    new TipCalculatorService(),
    new StubRateConverter(),
  );
  const getFavorites = new GetFavoritesUseCase(
    new FavoritesService(buildFavoritesRepo(favorites)),
  );
  const component = new TipCalculator(root, language, useCase, getFavorites);
  return { root, component };
};

describe('TipCalculator (UI)', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders the bill input, percent presets, and result rows', () => {
    const { root } = makeComponent();
    expect(root.querySelector('input[name="bill"]')).not.toBeNull();
    expect(root.querySelectorAll('[data-percent]').length).toBeGreaterThan(0);
    expect(root.querySelector('[data-result="total"]')).not.toBeNull();
  });

  it('shows the computed total in both currencies after entering a bill', () => {
    const { root } = makeComponent();
    const bill = root.querySelector('input[name="bill"]') as HTMLInputElement;
    const billCurrency = root.querySelector(
      'select[name="billCurrency"]',
    ) as HTMLSelectElement;
    const homeCurrency = root.querySelector(
      'select[name="homeCurrency"]',
    ) as HTMLSelectElement;
    billCurrency.value = 'EUR';
    billCurrency.dispatchEvent(new Event('change'));
    homeCurrency.value = 'USD';
    homeCurrency.dispatchEvent(new Event('change'));
    bill.value = '40';
    bill.dispatchEvent(new Event('input'));

    const total = root.querySelector('[data-result="total"]') as HTMLElement;
    expect(total.textContent).toContain('44');
    expect(total.textContent).toContain('48.4');
  });

  it('shows an em-dash for the home column when no rate is available', () => {
    const { root } = makeComponent();
    const bill = root.querySelector('input[name="bill"]') as HTMLInputElement;
    const billCurrency = root.querySelector(
      'select[name="billCurrency"]',
    ) as HTMLSelectElement;
    const homeCurrency = root.querySelector(
      'select[name="homeCurrency"]',
    ) as HTMLSelectElement;
    billCurrency.value = 'JPY';
    billCurrency.dispatchEvent(new Event('change'));
    homeCurrency.value = 'EUR';
    homeCurrency.dispatchEvent(new Event('change'));
    bill.value = '5000';
    bill.dispatchEvent(new Event('input'));

    const total = root.querySelector('[data-result="total"]') as HTMLElement;
    expect(total.textContent).toContain('—');
  });

  it('leaves the home column blank when the bill input is empty', () => {
    const { root } = makeComponent();
    const homeTotal = root.querySelector(
      '[data-result-home="total"]',
    ) as HTMLElement;
    // No user input — home column must be empty, NOT '—'.
    expect(homeTotal.textContent ?? '').not.toContain('—');
  });

  it('renders one chip per money favorite and applies the pair on click', () => {
    const favorites = [
      Favorite.create({
        type: 'money',
        fromUnit: 'EUR',
        toUnit: 'USD',
        label: 'EUR → USD',
      }),
      Favorite.create({
        type: 'money',
        fromUnit: 'JPY',
        toUnit: 'EUR',
        label: 'JPY → EUR',
      }),
      Favorite.create({
        type: 'weight',
        fromUnit: 'kg',
        toUnit: 'lb',
        label: 'kg → lb',
      }),
    ];
    const { root } = makeComponent(favorites);

    const chips = root.querySelectorAll<HTMLButtonElement>(
      '.tip-favorites__chip',
    );
    expect(chips.length).toBe(2);
    expect(chips[0]?.textContent).toContain('EUR');
    expect(chips[0]?.textContent).toContain('USD');

    const billCurrency = root.querySelector(
      'select[name="billCurrency"]',
    ) as HTMLSelectElement;
    const homeCurrency = root.querySelector(
      'select[name="homeCurrency"]',
    ) as HTMLSelectElement;
    billCurrency.value = 'GBP';
    homeCurrency.value = 'CHF';

    chips[1]?.click();
    expect(billCurrency.value).toBe('JPY');
    expect(homeCurrency.value).toBe('EUR');
  });

  it('does not render the favorites row when there are no money favorites', () => {
    const { root } = makeComponent([
      Favorite.create({
        type: 'distance',
        fromUnit: 'km',
        toUnit: 'mi',
        label: 'km → mi',
      }),
    ]);
    expect(root.querySelector('.tip-favorites')).toBeNull();
  });

  it('shows currency names alongside the code in the select options', () => {
    const { root } = makeComponent();
    const billOption = root.querySelector(
      'select[name="billCurrency"] option[value="EUR"]',
    ) as HTMLOptionElement | null;
    expect(billOption?.textContent).toMatch(/EUR.*Euro/);
  });

  it('updates the default percent when the bill currency changes (only before user touches it)', () => {
    const { root } = makeComponent();
    const billCurrency = root.querySelector(
      'select[name="billCurrency"]',
    ) as HTMLSelectElement;

    billCurrency.value = 'USD';
    billCurrency.dispatchEvent(new Event('change'));
    const activeUsd = root.querySelector('[data-percent].is-active');
    expect(activeUsd?.getAttribute('data-percent')).toBe('18');

    const five = root.querySelector('[data-percent="5"]') as HTMLButtonElement;
    five.click();

    billCurrency.value = 'JPY';
    billCurrency.dispatchEvent(new Event('change'));
    const stillFive = root.querySelector('[data-percent].is-active');
    expect(stillFive?.getAttribute('data-percent')).toBe('5');
  });
});
