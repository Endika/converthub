import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConvertDistanceUseCase } from '../../../../../contexts/conversion/application/ConvertDistanceUseCase';
import { DistanceConversionService } from '../../../../../contexts/conversion/domain/services/DistanceConversionService';
import { AddToHistoryUseCase } from '../../../../../contexts/history/application/AddToHistoryUseCase';
import type { HistoryRepositoryPort } from '../../../../../contexts/history/domain/ports/out/HistoryRepositoryPort';
import { HistoryService } from '../../../../../contexts/history/domain/services/HistoryService';
import { LanguageCode } from '../../../../../contexts/language/domain/model/LanguageCode';
import { LanguageService } from '../../../../../contexts/language/domain/services/LanguageService';
import { UnitConverter, type UnitConverterConfig } from '../UnitConverter';

const distanceConfig: UnitConverterConfig = {
  type: 'distance',
  units: ['km', 'mi', 'm'],
  defaultFrom: 'km',
  defaultTo: 'mi',
  acceptsNegative: false,
};

const buildHistoryRepo = (): HistoryRepositoryPort => {
  const state: Parameters<HistoryRepositoryPort['saveAll']>[0][number][] = [];
  return {
    loadAll: () => [...state],
    saveAll: (entries) => {
      state.length = 0;
      state.push(...entries);
    },
  };
};

describe('UnitConverter', () => {
  let root: HTMLElement;
  let language: LanguageService;
  let useCase: ConvertDistanceUseCase;
  let historyRepo: HistoryRepositoryPort;
  let addToHistoryUseCase: AddToHistoryUseCase;

  beforeEach(() => {
    root = document.createElement('div');
    language = new LanguageService(LanguageCode.fromTrusted('en'));
    useCase = new ConvertDistanceUseCase(new DistanceConversionService());
    historyRepo = buildHistoryRepo();
    addToHistoryUseCase = new AddToHistoryUseCase(
      new HistoryService(historyRepo),
    );
  });

  it('renders inputs with default from/to selected', () => {
    new UnitConverter(
      root,
      language,
      useCase,
      addToHistoryUseCase,
      distanceConfig,
    );
    const fromSelect = root.querySelector<HTMLSelectElement>(
      'select[name="from"]',
    );
    const toSelect = root.querySelector<HTMLSelectElement>('select[name="to"]');
    expect(fromSelect?.value).toBe('km');
    expect(toSelect?.value).toBe('mi');
  });

  it('converts on submit and stores in history with the right type', () => {
    const onHistoryChanged = vi.fn();
    new UnitConverter(
      root,
      language,
      useCase,
      addToHistoryUseCase,
      distanceConfig,
      { onHistoryChanged },
    );
    const amount = root.querySelector<HTMLInputElement>('input[name="amount"]');
    if (amount === null) throw new Error('amount input missing');
    amount.value = '10';
    root
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    const result = root.querySelector('.converter__result')?.textContent ?? '';
    expect(result).toContain('10');
    expect(result).toContain('km');
    expect(result).toContain('mi');
    expect(onHistoryChanged).toHaveBeenCalledTimes(1);
    expect(historyRepo.loadAll()[0]?.type).toBe('distance');
  });

  it('shows an error for invalid values', () => {
    new UnitConverter(
      root,
      language,
      useCase,
      addToHistoryUseCase,
      distanceConfig,
    );
    const amount = root.querySelector<HTMLInputElement>('input[name="amount"]');
    if (amount === null) throw new Error('amount input missing');
    amount.value = '-1';
    root
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    expect(
      root.querySelector('.converter__result')?.textContent?.toLowerCase(),
    ).toContain('invalid');
  });

  it('uses custom unit labels when provided', () => {
    new UnitConverter(root, language, useCase, addToHistoryUseCase, {
      ...distanceConfig,
      unitLabels: { km: 'Kilometers', mi: 'Miles', m: 'Meters' },
    });
    const options = root.querySelectorAll<HTMLOptionElement>(
      'select[name="from"] option',
    );
    const texts = Array.from(options).map((o) => o.textContent);
    expect(texts).toContain('Kilometers');
    expect(texts).toContain('Miles');
  });

  it('allows negative input when acceptsNegative is true', () => {
    new UnitConverter(root, language, useCase, addToHistoryUseCase, {
      ...distanceConfig,
      acceptsNegative: true,
    });
    const amount = root.querySelector<HTMLInputElement>('input[name="amount"]');
    expect(amount?.hasAttribute('min')).toBe(false);
  });

  it('stops listening after destroy()', () => {
    const conv = new UnitConverter(
      root,
      language,
      useCase,
      addToHistoryUseCase,
      distanceConfig,
    );
    conv.destroy();
    const before = root.innerHTML;
    language.change(LanguageCode.fromTrusted('es'));
    expect(root.innerHTML).toBe(before);
  });
});
