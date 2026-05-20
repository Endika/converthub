import { beforeEach, describe, expect, it } from 'vitest';
import { ClearHistoryUseCase } from '../../../../../contexts/history/application/ClearHistoryUseCase';
import { GetHistoryUseCase } from '../../../../../contexts/history/application/GetHistoryUseCase';
import { ConversionEntry } from '../../../../../contexts/history/domain/model/ConversionEntry';
import type { HistoryRepositoryPort } from '../../../../../contexts/history/domain/ports/out/HistoryRepositoryPort';
import { HistoryService } from '../../../../../contexts/history/domain/services/HistoryService';
import { LanguageCode } from '../../../../../contexts/language/domain/model/LanguageCode';
import { LanguageService } from '../../../../../contexts/language/domain/services/LanguageService';
import { HistoryList } from '../HistoryList';

const buildRepo = (initial: ConversionEntry[] = []): HistoryRepositoryPort => {
  let state = initial;
  return {
    loadAll: () => [...state],
    saveAll: (entries) => {
      state = [...entries];
    },
  };
};

const entry = (from: string, to: string): ConversionEntry =>
  ConversionEntry.create({
    type: 'money',
    fromValue: '1',
    fromUnit: from,
    toValue: '0.92',
    toUnit: to,
  });

describe('HistoryList', () => {
  let root: HTMLElement;
  let language: LanguageService;

  beforeEach(() => {
    root = document.createElement('div');
    language = new LanguageService(LanguageCode.fromTrusted('en'));
  });

  it('renders one item per history entry', () => {
    const service = new HistoryService(
      buildRepo([entry('USD', 'EUR'), entry('EUR', 'GBP')]),
    );
    new HistoryList(
      root,
      language,
      new GetHistoryUseCase(service),
      new ClearHistoryUseCase(service),
    );
    expect(root.querySelectorAll('.entry-list__item')).toHaveLength(2);
  });

  it('clears the list when the clear button is clicked', () => {
    const service = new HistoryService(buildRepo([entry('USD', 'EUR')]));
    new HistoryList(
      root,
      language,
      new GetHistoryUseCase(service),
      new ClearHistoryUseCase(service),
    );
    const btn = root.querySelector<HTMLButtonElement>('[data-action="clear"]');
    btn?.click();
    expect(root.querySelectorAll('.entry-list__item')).toHaveLength(0);
  });

  it('refresh() re-renders from the repository', () => {
    const repo = buildRepo([entry('USD', 'EUR')]);
    const service = new HistoryService(repo);
    const list = new HistoryList(
      root,
      language,
      new GetHistoryUseCase(service),
      new ClearHistoryUseCase(service),
    );
    repo.saveAll([entry('USD', 'EUR'), entry('GBP', 'JPY')]);
    list.refresh();
    expect(root.querySelectorAll('.entry-list__item')).toHaveLength(2);
  });
});
