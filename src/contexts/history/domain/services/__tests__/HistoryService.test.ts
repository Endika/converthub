import { describe, expect, it } from 'vitest';
import { ConversionEntry } from '../../model/ConversionEntry';
import type { HistoryRepositoryPort } from '../../ports/out/HistoryRepositoryPort';
import { HistoryService } from '../HistoryService';

const buildRepo = (initial: ConversionEntry[] = []): HistoryRepositoryPort => {
  let state = initial;
  return {
    loadAll: () => [...state],
    saveAll: (entries) => {
      state = [...entries];
    },
  };
};

const sampleEntry = (id?: string): ConversionEntry =>
  new ConversionEntry(id ?? crypto.randomUUID(), {
    type: 'money',
    fromValue: '1',
    fromUnit: 'USD',
    toValue: '1',
    toUnit: 'EUR',
    timestamp: new Date(),
  });

describe('HistoryService', () => {
  it('adds an entry at the head', () => {
    const repo = buildRepo();
    const service = new HistoryService(repo);
    const e = sampleEntry('1');
    service.add(e);
    expect(repo.loadAll()[0]?.id).toBe('1');
  });

  it('evicts oldest entry once the max is exceeded (FIFO)', () => {
    const repo = buildRepo();
    const service = new HistoryService(repo, 3);
    service.add(sampleEntry('1'));
    service.add(sampleEntry('2'));
    service.add(sampleEntry('3'));
    service.add(sampleEntry('4'));
    const list = service.list();
    expect(list).toHaveLength(3);
    expect(list.map((e) => e.id)).toEqual(['4', '3', '2']);
  });

  it('lists current entries from the repository', () => {
    const repo = buildRepo([sampleEntry('a'), sampleEntry('b')]);
    const service = new HistoryService(repo);
    expect(service.list()).toHaveLength(2);
  });

  it('clears all entries', () => {
    const repo = buildRepo([sampleEntry('a')]);
    const service = new HistoryService(repo);
    service.clear();
    expect(service.list()).toEqual([]);
  });
});
