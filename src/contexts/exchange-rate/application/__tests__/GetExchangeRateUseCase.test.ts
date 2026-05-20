import { describe, expect, it, vi } from 'vitest';
import { isErr, isOk } from '../../../../shared-kernel/domain/Result';
import { RateNotFoundError } from '../../domain/errors/RateNotFoundError';
import { ExchangeRateSnapshot } from '../../domain/model/ExchangeRateSnapshot';
import type { ExchangeRateRepositoryPort } from '../../domain/ports/out/ExchangeRateRepositoryPort';
import { ExchangeRateService } from '../../domain/services/ExchangeRateService';
import { GetExchangeRateUseCase } from '../GetExchangeRateUseCase';

const makeRepo = (snapshot: ExchangeRateSnapshot | null): ExchangeRateRepositoryPort => ({
  load: vi.fn(() => snapshot),
  save: vi.fn(),
});

describe('GetExchangeRateUseCase', () => {
  it('returns rate when available', () => {
    const snap = new ExchangeRateSnapshot('USD', { EUR: 0.92 }, new Date());
    const useCase = new GetExchangeRateUseCase(
      new ExchangeRateService(makeRepo(snap)),
    );
    const r = useCase.execute('EUR');
    expect(isOk(r)).toBe(true);
    if (isOk(r)) expect(r.value).toBe(0.92);
  });

  it('returns RateNotFoundError when missing', () => {
    const useCase = new GetExchangeRateUseCase(
      new ExchangeRateService(makeRepo(null)),
    );
    const r = useCase.execute('EUR');
    expect(isErr(r)).toBe(true);
    if (isErr(r)) expect(r.error).toBeInstanceOf(RateNotFoundError);
  });
});
