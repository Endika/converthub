import { describe, expect, it, vi } from 'vitest';
import { ConvertMoneyUseCase } from '../../../../../contexts/conversion/application/ConvertMoneyUseCase';
import { RateNotAvailableError } from '../../../../../contexts/conversion/domain/errors/RateNotAvailableError';
import type { CurrencyCode } from '../../../../../contexts/conversion/domain/model/CurrencyCode';
import type { ExchangeRateProviderPort } from '../../../../../contexts/conversion/domain/ports/out/ExchangeRateProviderPort';
import { MoneyConversionService } from '../../../../../contexts/conversion/domain/services/MoneyConversionService';
import { UpdateExchangeRatesUseCase } from '../../../../../contexts/exchange-rate/application/UpdateExchangeRatesUseCase';
import { ExchangeRateFetchError } from '../../../../../contexts/exchange-rate/domain/errors/ExchangeRateFetchError';
import { ExchangeRateSnapshot } from '../../../../../contexts/exchange-rate/domain/model/ExchangeRateSnapshot';
import type { ExchangeRateApiPort } from '../../../../../contexts/exchange-rate/domain/ports/out/ExchangeRateApiPort';
import type { ExchangeRateRepositoryPort } from '../../../../../contexts/exchange-rate/domain/ports/out/ExchangeRateRepositoryPort';
import { AddToHistoryUseCase } from '../../../../../contexts/history/application/AddToHistoryUseCase';
import type { HistoryRepositoryPort } from '../../../../../contexts/history/domain/ports/out/HistoryRepositoryPort';
import { HistoryService } from '../../../../../contexts/history/domain/services/HistoryService';
import { LanguageCode } from '../../../../../contexts/language/domain/model/LanguageCode';
import { LanguageService } from '../../../../../contexts/language/domain/services/LanguageService';
import type { LoggerPort } from '../../../../../shared-kernel/ports/LoggerPort';
import {
  err,
  ok,
  type Result,
} from '../../../../../shared-kernel/domain/Result';
import { AddFavoriteUseCase } from '../../../../../contexts/favorites/application/AddFavoriteUseCase';
import type { Favorite } from '../../../../../contexts/favorites/domain/model/Favorite';
import type { FavoritesRepositoryPort } from '../../../../../contexts/favorites/domain/ports/out/FavoritesRepositoryPort';
import { FavoritesService } from '../../../../../contexts/favorites/domain/services/FavoritesService';
import { GetPinnedCurrenciesUseCase } from '../../../../../contexts/pinned-currencies/application/GetPinnedCurrenciesUseCase';
import { PinCurrencyUseCase } from '../../../../../contexts/pinned-currencies/application/PinCurrencyUseCase';
import { UnpinCurrencyUseCase } from '../../../../../contexts/pinned-currencies/application/UnpinCurrencyUseCase';
import { PinnedCurrency } from '../../../../../contexts/pinned-currencies/domain/model/PinnedCurrency';
import type { PinnedCurrenciesRepositoryPort } from '../../../../../contexts/pinned-currencies/domain/ports/out/PinnedCurrenciesRepositoryPort';
import { PinningService } from '../../../../../contexts/pinned-currencies/domain/services/PinningService';
import {
  MoneyConverter,
  type MoneyConverterCallbacks,
} from '../MoneyConverter';

const buildProvider = (
  rates: Record<string, number>,
): ExchangeRateProviderPort => ({
  getRate(c: CurrencyCode): Result<number, RateNotAvailableError> {
    const r = rates[c.value];
    return r === undefined ? err(new RateNotAvailableError(c.value)) : ok(r);
  },
});

const buildHistoryRepo = (): HistoryRepositoryPort => {
  const state: ReturnType<HistoryRepositoryPort['loadAll']> = [];
  return {
    loadAll: () => [...state],
    saveAll: (entries) => {
      state.length = 0;
      state.push(...entries);
    },
  };
};

const silentLogger: LoggerPort = {
  debug: () => undefined,
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
};

interface MountOptions {
  rates?: Record<string, number>;
  lastUpdatedAt?: Date | null;
  apiResult?: Awaited<ReturnType<ExchangeRateApiPort['fetchLatest']>>;
  callbacks?: MoneyConverterCallbacks;
  pinned?: readonly string[];
  maxPinned?: number;
}

interface Mounted {
  converter: MoneyConverter;
  root: HTMLElement;
  language: LanguageService;
  historyRepo: HistoryRepositoryPort;
  ratesRepo: ExchangeRateRepositoryPort;
  api: ExchangeRateApiPort;
  pinningRepo: PinnedCurrenciesRepositoryPort;
  favoritesRepo: FavoritesRepositoryPort;
}

const mount = (options: MountOptions = {}): Mounted => {
  const root = document.createElement('div');
  const language = new LanguageService(LanguageCode.fromTrusted('en'));
  const rates = options.rates ?? { USD: 1, EUR: 0.92, GBP: 0.79 };
  const convertUseCase = new ConvertMoneyUseCase(
    new MoneyConversionService(buildProvider(rates)),
  );
  const historyRepo = buildHistoryRepo();
  const addToHistory = new AddToHistoryUseCase(new HistoryService(historyRepo));
  const ratesRepo: ExchangeRateRepositoryPort = {
    load: () => null,
    save: vi.fn(),
  };
  const api: ExchangeRateApiPort = {
    fetchLatest: vi.fn(async () => options.apiResult ?? ok({ EUR: 0.92 })),
  };
  const updateRates = new UpdateExchangeRatesUseCase(
    api,
    ratesRepo,
    silentLogger,
  );
  const pinningRepo: PinnedCurrenciesRepositoryPort = (() => {
    let state: PinnedCurrency[] = (options.pinned ?? []).map(
      (code) => new PinnedCurrency(code),
    );
    return {
      loadAll: () => [...state],
      saveAll: (items) => {
        state = [...items];
      },
    };
  })();
  const pinningService = new PinningService(
    pinningRepo,
    options.maxPinned ?? 5,
  );
  const lastUpdatedAt =
    options.lastUpdatedAt === undefined ? null : options.lastUpdatedAt;

  const favoritesRepo: FavoritesRepositoryPort = (() => {
    let state: Favorite[] = [];
    return {
      loadAll: () => [...state],
      saveAll: (items) => {
        state = [...items];
      },
    };
  })();
  const favoritesService = new FavoritesService(favoritesRepo);

  const converter = new MoneyConverter(
    root,
    language,
    {
      convertMoney: convertUseCase,
      addToHistory,
      addFavorite: new AddFavoriteUseCase(favoritesService),
      updateRates,
      getLastUpdatedAt: () => lastUpdatedAt,
      pinCurrency: new PinCurrencyUseCase(pinningService),
      unpinCurrency: new UnpinCurrencyUseCase(pinningService),
      getPinnedCurrencies: new GetPinnedCurrenciesUseCase(pinningService),
    },
    options.callbacks,
  );
  return {
    converter,
    root,
    language,
    historyRepo,
    ratesRepo,
    api,
    pinningRepo,
    favoritesRepo,
  };
};

describe('MoneyConverter', () => {
  describe('rendering', () => {
    it('renders form inputs and selects', () => {
      const { root } = mount();
      expect(root.querySelector('input[name="amount"]')).not.toBeNull();
      expect(root.querySelector('select[name="from"]')).not.toBeNull();
      expect(root.querySelector('select[name="to"]')).not.toBeNull();
    });

    it('shows localized currency names in the select options', () => {
      const { root } = mount();
      const options = Array.from(
        root.querySelectorAll<HTMLOptionElement>('select[name="from"] option'),
      );
      const usd = options.find((o) => o.value === 'USD');
      const eur = options.find((o) => o.value === 'EUR');
      expect(usd?.textContent?.toLowerCase()).toContain('dollar');
      expect(usd?.textContent).toMatch(/^USD\b/);
      expect(eur?.textContent?.toLowerCase()).toContain('euro');
    });

    it('falls back to the bare code when Intl.DisplayNames is unavailable', () => {
      const original = Intl.DisplayNames;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (Intl as any).DisplayNames = function () {
        throw new Error('not supported');
      };
      try {
        const { root } = mount();
        const usd = Array.from(
          root.querySelectorAll<HTMLOptionElement>(
            'select[name="from"] option',
          ),
        ).find((o) => o.value === 'USD');
        expect(usd?.textContent).toBe('USD');
      } finally {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (Intl as any).DisplayNames = original;
      }
    });

    it('shows the full currency name beneath each select as a hint', () => {
      const { root } = mount();
      const fromHint = root.querySelector('[data-hint="from"]')?.textContent;
      const toHint = root.querySelector('[data-hint="to"]')?.textContent;
      expect(fromHint?.toLowerCase()).toContain('dollar');
      expect(toHint?.toLowerCase()).toContain('euro');
    });

    it('updates the hint when the user changes the selected currency', () => {
      const { root } = mount();
      const fromSelect = root.querySelector<HTMLSelectElement>(
        'select[name="from"]',
      );
      if (fromSelect === null) throw new Error('from select missing');
      fromSelect.value = 'GBP';
      fromSelect.dispatchEvent(new Event('change'));
      expect(
        root.querySelector('[data-hint="from"]')?.textContent?.toLowerCase(),
      ).toContain('pound');
    });

    it('relocalizes currency names when the language changes', () => {
      const { root, language } = mount();
      language.change(LanguageCode.fromTrusted('es'));
      const usd = Array.from(
        root.querySelectorAll<HTMLOptionElement>('select[name="from"] option'),
      ).find((o) => o.value === 'USD');
      expect(usd?.textContent?.toLowerCase()).toContain('dólar');
    });
  });

  describe('conversion', () => {
    it('converts on submit and adds entry to history', () => {
      const onHistoryChanged = vi.fn();
      const { root, historyRepo } = mount({ callbacks: { onHistoryChanged } });
      const amount = root.querySelector<HTMLInputElement>(
        'input[name="amount"]',
      );
      if (amount === null) throw new Error('amount input missing');
      amount.value = '100';
      root
        .querySelector('form')
        ?.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        );
      const result =
        root.querySelector('.converter__result')?.textContent ?? '';
      expect(result).toContain('100');
      expect(result).toContain('USD');
      expect(result).toContain('EUR');
      expect(historyRepo.loadAll()).toHaveLength(1);
      expect(onHistoryChanged).toHaveBeenCalledTimes(1);
    });

    it('shows "invalid amount" for a negative input', () => {
      const { root } = mount();
      const amount = root.querySelector<HTMLInputElement>(
        'input[name="amount"]',
      );
      if (amount === null) throw new Error('amount input missing');
      amount.value = '-1';
      root
        .querySelector('form')
        ?.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        );
      expect(
        root.querySelector('.converter__result')?.textContent?.toLowerCase(),
      ).toContain('invalid amount');
    });

    it('shows "rate not available" when the provider has no rate', () => {
      const { root } = mount({ rates: { USD: 1 } }); // no EUR rate
      root
        .querySelector('form')
        ?.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        );
      expect(
        root.querySelector('.converter__result')?.textContent?.toLowerCase(),
      ).toContain('rate not available');
    });
  });

  describe('rates status', () => {
    it('shows "rates not loaded yet" when no snapshot has ever been fetched', () => {
      const { root } = mount({ lastUpdatedAt: null });
      const label = root
        .querySelector('[data-region="rates-label"]')
        ?.textContent?.toLowerCase();
      expect(label).toContain('not loaded');
    });

    it('shows the last-updated timestamp when a snapshot exists', () => {
      const lastUpdatedAt = new Date('2026-05-20T12:34:00Z');
      const { root } = mount({ lastUpdatedAt });
      const label =
        root.querySelector('[data-region="rates-label"]')?.textContent ?? '';
      expect(label.toLowerCase()).toContain('rates from');
      expect(label).toMatch(/2026|26/);
    });

    it('refreshes rates on click and updates the label on success', async () => {
      const newSnapshot = new ExchangeRateSnapshot(
        'USD',
        { EUR: 0.93 },
        new Date(),
      );
      const { root, api, ratesRepo } = mount({
        apiResult: ok({ EUR: 0.93 }),
      });
      const button = root.querySelector<HTMLButtonElement>(
        '[data-action="refresh"]',
      );
      if (button === null) throw new Error('refresh button missing');
      await button.click();
      // wait microtask for the async to settle
      await Promise.resolve();
      await Promise.resolve();
      expect(api.fetchLatest).toHaveBeenCalled();
      expect(ratesRepo.save).toHaveBeenCalled();
      expect(button.disabled).toBe(false);
      // keep newSnapshot referenced so the linter does not complain
      expect(newSnapshot.baseCurrency).toBe('USD');
    });

    it('marks the status as offline when the refresh fails', async () => {
      const { root, api } = mount({
        lastUpdatedAt: new Date('2026-05-19T08:00:00Z'),
        apiResult: err(new ExchangeRateFetchError('down')),
      });
      const button = root.querySelector<HTMLButtonElement>(
        '[data-action="refresh"]',
      );
      if (button === null) throw new Error('refresh button missing');
      await button.click();
      await Promise.resolve();
      await Promise.resolve();
      expect(api.fetchLatest).toHaveBeenCalled();
      const container = root.querySelector('[data-region="rates-status"]');
      expect(container?.classList.contains('rates-status--offline')).toBe(true);
      expect(
        root
          .querySelector('[data-region="rates-label"]')
          ?.textContent?.toLowerCase(),
      ).toContain('offline');
    });
  });

  describe('pinned currencies', () => {
    it('renders only the All group when no currencies are pinned', () => {
      const { root } = mount();
      const optgroups = root.querySelectorAll('select[name="from"] optgroup');
      expect(optgroups).toHaveLength(0);
    });

    it('renders a Favorites optgroup with the pinned codes first', () => {
      const { root } = mount({ pinned: ['JPY', 'GBP'] });
      const groups = root.querySelectorAll<HTMLOptGroupElement>(
        'select[name="from"] optgroup',
      );
      expect(groups).toHaveLength(2);
      expect(groups[0]?.label.toLowerCase()).toContain('favorite');
      const firstGroupValues = Array.from(
        groups[0]?.querySelectorAll<HTMLOptionElement>('option') ?? [],
      ).map((o) => o.value);
      expect(firstGroupValues).toEqual(['JPY', 'GBP']);
    });

    it('marks the pin button as pressed when the current currency is pinned', () => {
      const { root } = mount({ pinned: ['USD'] });
      const btn = root.querySelector<HTMLButtonElement>('[data-pin="from"]');
      expect(btn?.getAttribute('aria-pressed')).toBe('true');
    });

    it('pins a currency on click and adds it to favorites', () => {
      const { root, pinningRepo } = mount();
      const btn = root.querySelector<HTMLButtonElement>('[data-pin="from"]');
      btn?.click();
      expect(pinningRepo.loadAll().map((p) => p.code)).toContain('USD');
    });

    it('unpins a currency on click when it was pinned', () => {
      const { root, pinningRepo } = mount({ pinned: ['USD'] });
      const btn = root.querySelector<HTMLButtonElement>('[data-pin="from"]');
      btn?.click();
      expect(pinningRepo.loadAll().map((p) => p.code)).not.toContain('USD');
    });

    it('pins the "to" currency via its dedicated button', () => {
      const { root, pinningRepo } = mount();
      const btn = root.querySelector<HTMLButtonElement>('[data-pin="to"]');
      btn?.click();
      expect(pinningRepo.loadAll().map((p) => p.code)).toContain('EUR');
    });

    it('updates the "to" hint and pin state when the "to" select changes', () => {
      const { root } = mount({ pinned: ['JPY'] });
      const toSelect =
        root.querySelector<HTMLSelectElement>('select[name="to"]');
      if (toSelect === null) throw new Error('to select missing');
      toSelect.value = 'JPY';
      toSelect.dispatchEvent(new Event('change'));
      const toBtn = root.querySelector<HTMLButtonElement>('[data-pin="to"]');
      expect(toBtn?.getAttribute('aria-pressed')).toBe('true');
      expect(
        root.querySelector('[data-hint="to"]')?.textContent?.toLowerCase(),
      ).toContain('yen');
    });

    it('shows pin_full when trying to pin past the cap', () => {
      const { root } = mount({
        pinned: ['AED', 'AFN', 'ALL', 'AMD', 'ANG'],
        maxPinned: 5,
      });
      const fromSelect = root.querySelector<HTMLSelectElement>(
        'select[name="from"]',
      );
      if (fromSelect === null) throw new Error('from select missing');
      fromSelect.value = 'BRL';
      fromSelect.dispatchEvent(new Event('change'));
      const btn = root.querySelector<HTMLButtonElement>('[data-pin="from"]');
      btn?.click();
      const result = root.querySelector('.converter__result')?.textContent;
      expect(result?.toLowerCase()).toContain('full');
    });
  });

  describe('save as favorite', () => {
    const submitOnce = (root: HTMLElement, amount = '100'): void => {
      const input = root.querySelector<HTMLInputElement>(
        'input[name="amount"]',
      );
      if (input === null) throw new Error('amount input missing');
      input.value = amount;
      root
        .querySelector('form')
        ?.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true }),
        );
    };

    it('reveals the save-favorite button after a successful conversion', () => {
      const { root } = mount();
      const btn = root.querySelector<HTMLButtonElement>(
        '[data-action="save-favorite"]',
      );
      expect(btn?.hidden).toBe(true);
      submitOnce(root);
      expect(btn?.hidden).toBe(false);
    });

    it('hides the save-favorite button after a failed conversion', () => {
      const { root } = mount();
      submitOnce(root, '-1');
      const btn = root.querySelector<HTMLButtonElement>(
        '[data-action="save-favorite"]',
      );
      expect(btn?.hidden).toBe(true);
    });

    it('stores a favorite with the current currency pair and amount when clicked', () => {
      const onFavoriteSaved = vi.fn();
      const { root, favoritesRepo } = mount({
        callbacks: { onFavoriteSaved },
      });
      submitOnce(root, '100');
      root
        .querySelector<HTMLButtonElement>('[data-action="save-favorite"]')
        ?.click();
      expect(favoritesRepo.loadAll()).toHaveLength(1);
      const fav = favoritesRepo.loadAll()[0];
      expect(fav?.label).toBe('100 USD → EUR');
      expect(fav?.fromUnit).toBe('USD');
      expect(fav?.toUnit).toBe('EUR');
      expect(fav?.amount).toBe(100);
      expect(onFavoriteSaved).toHaveBeenCalledTimes(1);
    });

    it('stores a favorite without amount when the input is invalid', () => {
      const { root, favoritesRepo } = mount();
      submitOnce(root, '100'); // submit valid first so button shows
      const amount = root.querySelector<HTMLInputElement>(
        'input[name="amount"]',
      );
      if (amount === null) throw new Error('amount input missing');
      amount.value = '';
      root
        .querySelector<HTMLButtonElement>('[data-action="save-favorite"]')
        ?.click();
      const fav = favoritesRepo.loadAll()[0];
      expect(fav?.label).toBe('USD → EUR');
      expect(fav?.amount).toBeNull();
    });
  });

  describe('lifecycle', () => {
    it('stops listening after destroy()', () => {
      const { converter, root, language } = mount();
      converter.destroy();
      const before = root.innerHTML;
      language.change(LanguageCode.fromTrusted('es'));
      expect(root.innerHTML).toBe(before);
    });
  });
});
