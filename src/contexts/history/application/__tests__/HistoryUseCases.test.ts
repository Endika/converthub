import { describe, expect, it, vi } from 'vitest';
import { ConversionEntry } from '../../domain/model/ConversionEntry';
import type { HistoryRepositoryPort } from '../../domain/ports/out/HistoryRepositoryPort';
import { HistoryService } from '../../domain/services/HistoryService';
import { AddToHistoryUseCase } from '../AddToHistoryUseCase';
import { ClearHistoryUseCase } from '../ClearHistoryUseCase';
import { GetHistoryUseCase } from '../GetHistoryUseCase';

const buildRepo = (initial: ConversionEntry[] = []): HistoryRepositoryPort => {
  let state = initial;
  return {
    loadAll: vi.fn(() => [...state]),
    saveAll: vi.fn((entries) => {
      state = [...entries];
    }),
  };
};

const entry = (id: string): ConversionEntry =>
  new ConversionEntry(id, {
    type: 'money',
    fromValue: '1',
    fromUnit: 'USD',
    toValue: '1',
    toUnit: 'EUR',
    timestamp: new Date(),
  });

describe('History use cases', () => {
  it('AddToHistoryUseCase delegates to the service', () => {
    const repo = buildRepo();
    const service = new HistoryService(repo);
    new AddToHistoryUseCase(service).execute(entry('1'));
    expect(service.list().map((e) => e.id)).toEqual(['1']);
  });

  it('GetHistoryUseCase returns the stored entries', () => {
    const repo = buildRepo([entry('a'), entry('b')]);
    const useCase = new GetHistoryUseCase(new HistoryService(repo));
    expect(useCase.execute()).toHaveLength(2);
  });

  it('ClearHistoryUseCase empties the store', () => {
    const repo = buildRepo([entry('a')]);
    const service = new HistoryService(repo);
    new ClearHistoryUseCase(service).execute();
    expect(service.list()).toEqual([]);
  });
});
