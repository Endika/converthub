import { describe, expect, it, vi } from 'vitest';
import { ConvertMoneyUseCase } from '../../../../../contexts/conversion/application/ConvertMoneyUseCase';
import { RateNotAvailableError } from '../../../../../contexts/conversion/domain/errors/RateNotAvailableError';
import type { CurrencyCode } from '../../../../../contexts/conversion/domain/model/CurrencyCode';
import type { ExchangeRateProviderPort } from '../../../../../contexts/conversion/domain/ports/out/ExchangeRateProviderPort';
import { MoneyConversionService } from '../../../../../contexts/conversion/domain/services/MoneyConversionService';
import { GetFavoritesUseCase } from '../../../../../contexts/favorites/application/GetFavoritesUseCase';
import { RemoveFavoriteUseCase } from '../../../../../contexts/favorites/application/RemoveFavoriteUseCase';
import { Favorite } from '../../../../../contexts/favorites/domain/model/Favorite';
import type { FavoritesRepositoryPort } from '../../../../../contexts/favorites/domain/ports/out/FavoritesRepositoryPort';
import { FavoritesService } from '../../../../../contexts/favorites/domain/services/FavoritesService';
import { LanguageCode } from '../../../../../contexts/language/domain/model/LanguageCode';
import { LanguageService } from '../../../../../contexts/language/domain/services/LanguageService';
import {
  err,
  ok,
  type Result,
} from '../../../../../shared-kernel/domain/Result';
import { FavoritesList, type FavoritesListCallbacks } from '../FavoritesList';

const buildRepo = (initial: Favorite[] = []): FavoritesRepositoryPort => {
  let state = [...initial];
  return {
    loadAll: () => [...state],
    saveAll: (items) => {
      state = [...items];
    },
  };
};

const buildConvertUseCase = (
  rates: Record<string, number> = { USD: 1, EUR: 0.92 },
): ConvertMoneyUseCase => {
  const provider: ExchangeRateProviderPort = {
    getRate(c: CurrencyCode): Result<number, RateNotAvailableError> {
      const r = rates[c.value];
      return r === undefined ? err(new RateNotAvailableError(c.value)) : ok(r);
    },
  };
  return new ConvertMoneyUseCase(new MoneyConversionService(provider));
};

const mount = (
  initial: Favorite[] = [],
  callbacks: FavoritesListCallbacks = {},
  convertUseCase: ConvertMoneyUseCase = buildConvertUseCase(),
): { root: HTMLElement; repo: FavoritesRepositoryPort } => {
  const root = document.createElement('div');
  const language = new LanguageService(LanguageCode.fromTrusted('en'));
  const repo = buildRepo(initial);
  const service = new FavoritesService(repo);
  new FavoritesList(
    root,
    language,
    new GetFavoritesUseCase(service),
    new RemoveFavoriteUseCase(service),
    convertUseCase,
    callbacks,
  );
  return { root, repo };
};

describe('FavoritesList', () => {
  it('shows an empty message when no favorites exist', () => {
    const { root } = mount();
    expect(root.textContent?.toLowerCase()).toContain('no favorites');
    expect(root.querySelectorAll('[data-id]')).toHaveLength(0);
  });

  it('renders one item per stored favorite', () => {
    const fav = Favorite.create({
      type: 'money',
      fromUnit: 'USD',
      toUnit: 'EUR',
      label: 'USD → EUR',
    });
    const { root } = mount([fav]);
    const items = root.querySelectorAll<HTMLElement>('[data-id]');
    expect(items).toHaveLength(1);
    expect(items[0]?.textContent).toContain('USD → EUR');
  });

  it('removes a favorite from storage on click and re-renders', () => {
    const fav = Favorite.create({
      type: 'money',
      fromUnit: 'USD',
      toUnit: 'EUR',
      label: 'USD → EUR',
    });
    const { root, repo } = mount([fav]);
    root.querySelector<HTMLButtonElement>('[data-action="remove"]')?.click();
    expect(repo.loadAll()).toHaveLength(0);
    expect(root.querySelectorAll('[data-id]')).toHaveLength(0);
  });

  it('emits onApply with the full favorite when an item is clicked', () => {
    const fav = Favorite.create({
      type: 'money',
      fromUnit: 'USD',
      toUnit: 'JPY',
      label: 'USD → JPY',
    });
    const onApply = vi.fn();
    const { root } = mount([fav], { onApply });
    root.querySelector<HTMLButtonElement>('[data-action="apply"]')?.click();
    expect(onApply).toHaveBeenCalledTimes(1);
    expect(onApply.mock.calls[0]?.[0]?.fromUnit).toBe('USD');
    expect(onApply.mock.calls[0]?.[0]?.toUnit).toBe('JPY');
  });

  it('shows the live converted amount as the secondary line for money favorites', () => {
    const fav = Favorite.create({
      type: 'money',
      fromUnit: 'USD',
      toUnit: 'EUR',
      label: '100 USD → EUR',
      amount: 100,
    });
    const { root } = mount([fav]);
    const secondary = root.querySelector('.entry-list__secondary')?.textContent;
    expect(secondary).toContain('92');
    expect(secondary).toContain('EUR');
  });

  it('falls back to the type when no amount is stored', () => {
    const fav = Favorite.create({
      type: 'money',
      fromUnit: 'USD',
      toUnit: 'EUR',
      label: 'USD → EUR',
    });
    const { root } = mount([fav]);
    expect(root.querySelector('.entry-list__secondary')?.textContent).toBe(
      'money',
    );
  });

  it('removing a favorite does not also fire onApply', () => {
    const fav = Favorite.create({
      type: 'money',
      fromUnit: 'USD',
      toUnit: 'EUR',
      label: 'USD → EUR',
    });
    const onApply = vi.fn();
    const { root } = mount([fav], { onApply });
    root.querySelector<HTMLButtonElement>('[data-action="remove"]')?.click();
    expect(onApply).not.toHaveBeenCalled();
  });
});
