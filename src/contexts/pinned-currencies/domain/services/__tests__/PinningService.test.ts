import { describe, expect, it } from 'vitest';
import {
  err,
  isErr,
  isOk,
  ok,
} from '../../../../../shared-kernel/domain/Result';
import { StorageWriteError } from '../../../../../shared-kernel/domain/StorageWriteError';
import { PinnedCurrenciesFullError } from '../../errors/PinnedCurrenciesFullError';
import { PinnedCurrency } from '../../model/PinnedCurrency';
import type { PinnedCurrenciesRepositoryPort } from '../../ports/out/PinnedCurrenciesRepositoryPort';
import { PinningService } from '../PinningService';

const buildRepo = (
  initial: PinnedCurrency[] = [],
  failSave = false,
): PinnedCurrenciesRepositoryPort => {
  let state = initial;
  return {
    loadAll: () => [...state],
    saveAll: (items) => {
      if (failSave) return err(new StorageWriteError());
      state = [...items];
      return ok(undefined);
    },
  };
};

describe('PinningService', () => {
  it('pins a currency at the head of the list', () => {
    const service = new PinningService(buildRepo());
    expect(isOk(service.pin('USD'))).toBe(true);
    expect(service.list().map((p) => p.code)).toEqual(['USD']);
  });

  it('is idempotent when pinning an already-pinned currency', () => {
    const repo = buildRepo([new PinnedCurrency('USD')]);
    const service = new PinningService(repo);
    expect(isOk(service.pin('USD'))).toBe(true);
    expect(service.list()).toHaveLength(1);
  });

  it('returns PinnedCurrenciesFullError when the cap is reached', () => {
    const initial = Array.from(
      { length: 3 },
      (_, i) => new PinnedCurrency(`C${i}`),
    );
    const service = new PinningService(buildRepo(initial), 3);
    const result = service.pin('NEW');
    expect(isErr(result)).toBe(true);
    if (isErr(result))
      expect(result.error).toBeInstanceOf(PinnedCurrenciesFullError);
  });

  it('unpins a currency by code', () => {
    const repo = buildRepo([
      new PinnedCurrency('USD'),
      new PinnedCurrency('EUR'),
    ]);
    const service = new PinningService(repo);
    service.unpin('USD');
    expect(service.list().map((p) => p.code)).toEqual(['EUR']);
  });

  it('reports isPinned correctly', () => {
    const service = new PinningService(buildRepo([new PinnedCurrency('EUR')]));
    expect(service.isPinned('EUR')).toBe(true);
    expect(service.isPinned('USD')).toBe(false);
  });

  it('reports a StorageWriteError instead of claiming a currency was pinned', () => {
    const service = new PinningService(buildRepo([], true));
    const r = service.pin('USD');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(StorageWriteError);
  });
});
