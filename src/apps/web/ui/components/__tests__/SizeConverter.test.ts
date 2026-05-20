import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ConvertSizeUseCase } from '../../../../../contexts/conversion/application/ConvertSizeUseCase';
import { SizeConversionService } from '../../../../../contexts/conversion/domain/services/SizeConversionService';
import { AddToHistoryUseCase } from '../../../../../contexts/history/application/AddToHistoryUseCase';
import type { HistoryRepositoryPort } from '../../../../../contexts/history/domain/ports/out/HistoryRepositoryPort';
import { HistoryService } from '../../../../../contexts/history/domain/services/HistoryService';
import { LanguageCode } from '../../../../../contexts/language/domain/model/LanguageCode';
import { LanguageService } from '../../../../../contexts/language/domain/services/LanguageService';
import { SizeConverter } from '../SizeConverter';

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

describe('SizeConverter', () => {
  let root: HTMLElement;
  let language: LanguageService;
  let useCase: ConvertSizeUseCase;
  let historyRepo: HistoryRepositoryPort;
  let addToHistoryUseCase: AddToHistoryUseCase;

  beforeEach(() => {
    root = document.createElement('div');
    language = new LanguageService(LanguageCode.fromTrusted('en'));
    useCase = new ConvertSizeUseCase(new SizeConversionService());
    historyRepo = buildHistoryRepo();
    addToHistoryUseCase = new AddToHistoryUseCase(
      new HistoryService(historyRepo),
    );
  });

  it('renders selects for category, regions and labels', () => {
    new SizeConverter(root, language, useCase, addToHistoryUseCase);
    expect(root.querySelector('select[name="category"]')).not.toBeNull();
    expect(root.querySelector('select[name="fromRegion"]')).not.toBeNull();
    expect(root.querySelector('select[name="toRegion"]')).not.toBeNull();
    expect(root.querySelector('select[name="label"]')).not.toBeNull();
  });

  it('converts a size and stores it in history as type=size', () => {
    const onHistoryChanged = vi.fn();
    new SizeConverter(root, language, useCase, addToHistoryUseCase, {
      onHistoryChanged,
    });
    const labelSelect = root.querySelector<HTMLSelectElement>(
      'select[name="label"]',
    );
    if (labelSelect === null) throw new Error('label select missing');
    labelSelect.value = '42';
    root
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    const result = root.querySelector('.converter__result')?.textContent ?? '';
    expect(result).toContain('42');
    expect(onHistoryChanged).toHaveBeenCalledTimes(1);
    expect(historyRepo.loadAll()[0]?.type).toBe('size');
  });

  it('repopulates labels when the category changes', () => {
    new SizeConverter(root, language, useCase, addToHistoryUseCase);
    const categorySelect = root.querySelector<HTMLSelectElement>(
      'select[name="category"]',
    );
    if (categorySelect === null) throw new Error('category select missing');
    const before = Array.from(
      root.querySelectorAll<HTMLOptionElement>('select[name="label"] option'),
    ).map((o) => o.value);
    categorySelect.value = 'clothing_men';
    categorySelect.dispatchEvent(new Event('change'));
    const after = Array.from(
      root.querySelectorAll<HTMLOptionElement>('select[name="label"] option'),
    ).map((o) => o.value);
    expect(after).not.toEqual(before);
  });

  it('shows an error when the label is not in the target region table', () => {
    new SizeConverter(root, language, useCase, addToHistoryUseCase);
    const labelSelect = root.querySelector<HTMLSelectElement>(
      'select[name="label"]',
    );
    if (labelSelect === null) throw new Error('label select missing');
    labelSelect.innerHTML = '<option value="999" selected>999</option>';
    root
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    expect(
      root.querySelector('.converter__result')?.textContent?.toLowerCase(),
    ).toContain('invalid');
  });

  it('stops listening after destroy()', () => {
    const conv = new SizeConverter(
      root,
      language,
      useCase,
      addToHistoryUseCase,
    );
    conv.destroy();
    const before = root.innerHTML;
    language.change(LanguageCode.fromTrusted('es'));
    expect(root.innerHTML).toBe(before);
  });
});
