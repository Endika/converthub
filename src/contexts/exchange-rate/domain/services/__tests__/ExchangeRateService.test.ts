import { describe, expect, it, vi } from 'vitest';
import { isErr, isOk } from '../../../../../shared-kernel/domain/Result';
import { RateNotFoundError } from '../../errors/RateNotFoundError';
import { ExchangeRateSnapshot } from '../../model/ExchangeRateSnapshot';
import type { ExchangeRateRepositoryPort } from '../../ports/out/ExchangeRateRepositoryPort';
import { ExchangeRateService } from '../ExchangeRateService';

const makeRepo = (
  snapshot: ExchangeRateSnapshot | null,
): ExchangeRateRepositoryPort => ({
  load: vi.fn(() => snapshot),
  save: vi.fn(),
});

describe('ExchangeRateService', () => {
  it('returns the rate when present in snapshot', () => {
    const snap = new ExchangeRateSnapshot('USD', { EUR: 0.92 }, new Date());
    const service = new ExchangeRateService(makeRepo(snap));
    const result = service.getRate('EUR');
    expect(isOk(result)).toBe(true);
    if (isOk(result)) expect(result.value).toBe(0.92);
  });

  it('returns RateNotFoundError when no snapshot is stored', () => {
    const service = new ExchangeRateService(makeRepo(null));
    const result = service.getRate('EUR');
    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error).toBeInstanceOf(RateNotFoundError);
  });

  it('returns RateNotFoundError when currency missing from snapshot', () => {
    const snap = new ExchangeRateSnapshot('USD', { EUR: 0.92 }, new Date());
    const service = new ExchangeRateService(makeRepo(snap));
    const result = service.getRate('XYZ');
    expect(isErr(result)).toBe(true);
  });

  it('needsUpdate returns true when no snapshot stored', () => {
    const service = new ExchangeRateService(makeRepo(null));
    expect(service.needsUpdate()).toBe(true);
  });

  it('needsUpdate returns true when snapshot is stale', () => {
    const old = new Date('2026-01-01T00:00:00Z');
    const snap = new ExchangeRateSnapshot('USD', {}, old);
    const service = new ExchangeRateService(makeRepo(snap), 1000);
    expect(service.needsUpdate(new Date('2026-01-01T00:01:00Z'))).toBe(true);
  });

  it('needsUpdate returns false when snapshot is fresh', () => {
    const now = new Date();
    const snap = new ExchangeRateSnapshot('USD', {}, now);
    const service = new ExchangeRateService(makeRepo(snap));
    expect(service.needsUpdate(now)).toBe(false);
  });
});
