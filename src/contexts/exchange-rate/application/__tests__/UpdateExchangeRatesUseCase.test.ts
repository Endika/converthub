import { describe, expect, it, vi } from 'vitest';
import { err, isErr, isOk, ok } from '../../../../shared-kernel/domain/Result';
import type { LoggerPort } from '../../../../shared-kernel/ports/LoggerPort';
import { ExchangeRateFetchError } from '../../domain/errors/ExchangeRateFetchError';
import type { ExchangeRateApiPort } from '../../domain/ports/out/ExchangeRateApiPort';
import type { ExchangeRateRepositoryPort } from '../../domain/ports/out/ExchangeRateRepositoryPort';
import { UpdateExchangeRatesUseCase } from '../UpdateExchangeRatesUseCase';

const buildLogger = (): LoggerPort => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

describe('UpdateExchangeRatesUseCase', () => {
  it('fetches rates and persists the snapshot on success', async () => {
    const api: ExchangeRateApiPort = {
      fetchLatest: vi.fn(async () => ok({ EUR: 0.92, GBP: 0.79 })),
    };
    const repo: ExchangeRateRepositoryPort = {
      load: vi.fn(),
      save: vi.fn(),
    };
    const logger = buildLogger();
    const useCase = new UpdateExchangeRatesUseCase(api, repo, logger);

    const result = await useCase.execute();

    expect(isOk(result)).toBe(true);
    expect(api.fetchLatest).toHaveBeenCalledWith('USD');
    expect(repo.save).toHaveBeenCalledTimes(1);
    if (isOk(result)) {
      expect(result.value.baseCurrency).toBe('USD');
      expect(result.value.rates).toEqual({ EUR: 0.92, GBP: 0.79 });
    }
  });

  it('returns the api error and does not persist on failure', async () => {
    const fetchError = new ExchangeRateFetchError('network down');
    const api: ExchangeRateApiPort = {
      fetchLatest: vi.fn(async () => err(fetchError)),
    };
    const repo: ExchangeRateRepositoryPort = {
      load: vi.fn(),
      save: vi.fn(),
    };
    const useCase = new UpdateExchangeRatesUseCase(api, repo, buildLogger());

    const result = await useCase.execute();

    expect(isErr(result)).toBe(true);
    if (isErr(result)) expect(result.error).toBe(fetchError);
    expect(repo.save).not.toHaveBeenCalled();
  });

  it('honors a custom base currency', async () => {
    const api: ExchangeRateApiPort = {
      fetchLatest: vi.fn(async () => ok({ USD: 1.08 })),
    };
    const repo: ExchangeRateRepositoryPort = {
      load: vi.fn(),
      save: vi.fn(),
    };
    const useCase = new UpdateExchangeRatesUseCase(
      api,
      repo,
      buildLogger(),
      'EUR',
    );
    const result = await useCase.execute();
    expect(api.fetchLatest).toHaveBeenCalledWith('EUR');
    if (isOk(result)) expect(result.value.baseCurrency).toBe('EUR');
  });
});
