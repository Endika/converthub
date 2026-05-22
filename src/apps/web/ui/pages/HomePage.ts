import type { CalculateTipUseCase } from '../../../../contexts/tipping/application/CalculateTipUseCase';
import type { ConvertDistanceUseCase } from '../../../../contexts/conversion/application/ConvertDistanceUseCase';
import type { ConvertSizeUseCase } from '../../../../contexts/conversion/application/ConvertSizeUseCase';
import type { ConvertSpeedUseCase } from '../../../../contexts/conversion/application/ConvertSpeedUseCase';
import type { ConvertTemperatureUseCase } from '../../../../contexts/conversion/application/ConvertTemperatureUseCase';
import type { ConvertVolumeUseCase } from '../../../../contexts/conversion/application/ConvertVolumeUseCase';
import type { ConvertWeightUseCase } from '../../../../contexts/conversion/application/ConvertWeightUseCase';
import { DISTANCE_UNITS } from '../../../../contexts/conversion/domain/model/catalogs/distance';
import { SPEED_UNITS } from '../../../../contexts/conversion/domain/model/catalogs/speed';
import { TEMPERATURE_UNITS } from '../../../../contexts/conversion/domain/model/catalogs/temperature';
import { VOLUME_UNITS } from '../../../../contexts/conversion/domain/model/catalogs/volume';
import { WEIGHT_UNITS } from '../../../../contexts/conversion/domain/model/catalogs/weight';
import type { UpdateExchangeRatesUseCase } from '../../../../contexts/exchange-rate/application/UpdateExchangeRatesUseCase';
import type { RateProviderPreferencePort } from '../../../../contexts/exchange-rate/domain/ports/out/RateProviderPreferencePort';
import type { ExchangeRateService } from '../../../../contexts/exchange-rate/domain/services/ExchangeRateService';
import type { AddFavoriteUseCase } from '../../../../contexts/favorites/application/AddFavoriteUseCase';
import type { GetFavoritesUseCase } from '../../../../contexts/favorites/application/GetFavoritesUseCase';
import type { RemoveFavoriteUseCase } from '../../../../contexts/favorites/application/RemoveFavoriteUseCase';
import type { Favorite } from '../../../../contexts/favorites/domain/model/Favorite';
import type { AddToHistoryUseCase } from '../../../../contexts/history/application/AddToHistoryUseCase';
import type { ConversionEntry } from '../../../../contexts/history/domain/model/ConversionEntry';
import type { LanguageService } from '../../../../contexts/language/domain/services/LanguageService';
import type { AddNoteUseCase } from '../../../../contexts/notes/application/AddNoteUseCase';
import type { DeleteNoteUseCase } from '../../../../contexts/notes/application/DeleteNoteUseCase';
import type { GetNotesUseCase } from '../../../../contexts/notes/application/GetNotesUseCase';
import type { UpdateNoteUseCase } from '../../../../contexts/notes/application/UpdateNoteUseCase';
import type { GetPinnedCurrenciesUseCase } from '../../../../contexts/pinned-currencies/application/GetPinnedCurrenciesUseCase';
import type { PinCurrencyUseCase } from '../../../../contexts/pinned-currencies/application/PinCurrencyUseCase';
import type { UnpinCurrencyUseCase } from '../../../../contexts/pinned-currencies/application/UnpinCurrencyUseCase';
import type { Container } from '../../di/Container';
import { SERVICES } from '../../di/setup';
import { FavoritesList } from '../components/FavoritesList';
import { HistoryList } from '../components/HistoryList';
import { LanguageSelector } from '../components/LanguageSelector';
import { MoneyConverter } from '../components/MoneyConverter';
import { NotesList } from '../components/NotesList';
import { SettingsPanel } from '../components/SettingsPanel';
import { SidePanel, type SidePanelKey } from '../components/SidePanel';
import { SizeConverter } from '../components/SizeConverter';
import { TabNavigation, type TabDefinition } from '../components/TabNavigation';
import { TipCalculator } from '../components/TipCalculator';
import {
  UnitConverter,
  type UnitConverterConfig,
} from '../components/UnitConverter';

type TabKey =
  | 'currency'
  | 'distance'
  | 'weight'
  | 'volume'
  | 'temperature'
  | 'speed'
  | 'size'
  | 'tip';

const TABS: readonly TabDefinition<TabKey>[] = [
  { key: 'currency', labelKey: 'nav_currencies' },
  { key: 'distance', labelKey: 'nav_distance' },
  { key: 'weight', labelKey: 'nav_weight' },
  { key: 'volume', labelKey: 'nav_volume' },
  { key: 'temperature', labelKey: 'nav_temperature' },
  { key: 'speed', labelKey: 'nav_speed' },
  { key: 'size', labelKey: 'nav_sizes' },
  { key: 'tip', labelKey: 'nav_tip' },
];

const UNIT_CONFIGS: Record<
  Exclude<TabKey, 'currency' | 'size' | 'tip'>,
  UnitConverterConfig
> = {
  distance: {
    type: 'distance',
    units: DISTANCE_UNITS,
    defaultFrom: 'km',
    defaultTo: 'mi',
    acceptsNegative: false,
  },
  weight: {
    type: 'weight',
    units: WEIGHT_UNITS,
    defaultFrom: 'kg',
    defaultTo: 'lb',
    acceptsNegative: false,
  },
  volume: {
    type: 'volume',
    units: VOLUME_UNITS,
    defaultFrom: 'l',
    defaultTo: 'gal_us',
    acceptsNegative: false,
  },
  temperature: {
    type: 'temperature',
    units: TEMPERATURE_UNITS,
    defaultFrom: 'c',
    defaultTo: 'f',
    acceptsNegative: true,
    unitLabels: { c: '°C', f: '°F', k: 'K' },
  },
  speed: {
    type: 'speed',
    units: SPEED_UNITS,
    defaultFrom: 'kmh',
    defaultTo: 'mph',
    acceptsNegative: false,
    unitLabels: { kmh: 'km/h', mph: 'mph', ms: 'm/s', kn: 'kn' },
  },
};

interface Disposable {
  destroy(): void;
}

interface RefreshableDisposable extends Disposable {
  refresh(): void;
}

export class HomePage {
  private converterRegion!: HTMLElement;
  private currentConverter: Disposable | null = null;
  private sidePanel!: SidePanel;
  private currentSideList: RefreshableDisposable | null = null;

  constructor(
    private readonly root: HTMLElement,
    private readonly container: Container,
  ) {
    this.render();
  }

  private render(): void {
    this.root.innerHTML = `
      <header class="app-header">
        <h1>ConvertHub</h1>
        <nav class="lang" data-region="language"></nav>
      </header>
      <nav class="tabs" data-region="tabs"></nav>
      <main class="app-main">
        <section class="card" data-region="converter"></section>
        <section class="card" data-region="side"></section>
      </main>
    `;

    const langRegion = this.root.querySelector<HTMLElement>(
      '[data-region="language"]',
    );
    const tabsRegion = this.root.querySelector<HTMLElement>(
      '[data-region="tabs"]',
    );
    const converterRegion = this.root.querySelector<HTMLElement>(
      '[data-region="converter"]',
    );
    const sideRegion = this.root.querySelector<HTMLElement>(
      '[data-region="side"]',
    );
    if (
      langRegion === null ||
      tabsRegion === null ||
      converterRegion === null ||
      sideRegion === null
    ) {
      throw new Error('HomePage layout missing required regions');
    }
    this.converterRegion = converterRegion;

    new LanguageSelector(
      langRegion,
      this.container.get(SERVICES.languageService),
      this.container.get(SERVICES.changeLanguageUseCase),
    );

    this.sidePanel = new SidePanel(
      sideRegion,
      this.container.get(SERVICES.languageService),
      { onChange: (key) => this.switchSide(key) },
      'history',
    );
    this.switchSide('history');

    new TabNavigation(
      tabsRegion,
      this.container.get(SERVICES.languageService),
      TABS,
      { onChange: (key) => this.switchTo(key) },
      'currency',
    );

    this.switchTo('currency');
  }

  private applyConversion(
    type: Favorite['type'],
    from: string,
    to: string,
    amount: number | null,
  ): void {
    const tabByType: Record<Favorite['type'], TabKey | null> = {
      money: 'currency',
      distance: 'distance',
      weight: 'weight',
      volume: 'volume',
      temperature: 'temperature',
      speed: 'speed',
      size: null,
    };
    const tab = tabByType[type];
    if (tab === null) return;
    this.switchTo(tab);
    const conv = this.currentConverter as unknown as {
      setPair?: (from: string, to: string, amount?: number | null) => void;
    } | null;
    conv?.setPair?.(from, to, amount);
  }

  private applyFavorite(favorite: Favorite): void {
    this.applyConversion(
      favorite.type,
      favorite.fromUnit,
      favorite.toUnit,
      favorite.amount,
    );
  }

  private applyHistoryEntry(entry: ConversionEntry): void {
    const parsed = Number(entry.fromValue);
    const amount = Number.isFinite(parsed) ? parsed : null;
    this.applyConversion(entry.type, entry.fromUnit, entry.toUnit, amount);
  }

  private switchSide(key: SidePanelKey): void {
    this.currentSideList?.destroy();
    const region = this.sidePanel.contentRegion();
    region.innerHTML = '';
    const language = this.container.get<LanguageService>(
      SERVICES.languageService,
    );
    if (key === 'history') {
      this.currentSideList = new HistoryList(
        region,
        language,
        this.container.get(SERVICES.getHistoryUseCase),
        this.container.get(SERVICES.clearHistoryUseCase),
        { onApply: (entry) => this.applyHistoryEntry(entry) },
      );
    } else if (key === 'favorites') {
      this.currentSideList = new FavoritesList(
        region,
        language,
        this.container.get<GetFavoritesUseCase>(SERVICES.getFavoritesUseCase),
        this.container.get<RemoveFavoriteUseCase>(
          SERVICES.removeFavoriteUseCase,
        ),
        this.container.get(SERVICES.convertMoneyUseCase),
        { onApply: (favorite) => this.applyFavorite(favorite) },
      );
    } else if (key === 'notes') {
      this.currentSideList = new NotesList(
        region,
        language,
        this.container.get<GetNotesUseCase>(SERVICES.getNotesUseCase),
        this.container.get<AddNoteUseCase>(SERVICES.addNoteUseCase),
        this.container.get<UpdateNoteUseCase>(SERVICES.updateNoteUseCase),
        this.container.get<DeleteNoteUseCase>(SERVICES.deleteNoteUseCase),
      );
    } else {
      this.currentSideList = new SettingsPanel(
        region,
        language,
        this.container.get<RateProviderPreferencePort>(
          SERVICES.rateProviderPreference,
        ),
      );
    }
  }

  private switchTo(tab: TabKey): void {
    this.currentConverter?.destroy();
    this.converterRegion.innerHTML = '';
    this.currentConverter = this.buildConverter(tab);
  }

  private buildConverter(tab: TabKey): Disposable {
    const language = this.container.get<LanguageService>(
      SERVICES.languageService,
    );
    const addToHistory = this.container.get<AddToHistoryUseCase>(
      SERVICES.addToHistoryUseCase,
    );
    const callbacks = {
      onHistoryChanged: (): void => this.currentSideList?.refresh(),
      onFavoriteSaved: (): void => this.currentSideList?.refresh(),
    };

    if (tab === 'currency') {
      const exchangeRateService = this.container.get<ExchangeRateService>(
        SERVICES.exchangeRateService,
      );
      return new MoneyConverter(
        this.converterRegion,
        language,
        {
          convertMoney: this.container.get(SERVICES.convertMoneyUseCase),
          addToHistory,
          addFavorite: this.container.get<AddFavoriteUseCase>(
            SERVICES.addFavoriteUseCase,
          ),
          updateRates: this.container.get<UpdateExchangeRatesUseCase>(
            SERVICES.updateExchangeRatesUseCase,
          ),
          getLastUpdatedAt: () => exchangeRateService.getLastUpdatedAt(),
          pinCurrency: this.container.get<PinCurrencyUseCase>(
            SERVICES.pinCurrencyUseCase,
          ),
          unpinCurrency: this.container.get<UnpinCurrencyUseCase>(
            SERVICES.unpinCurrencyUseCase,
          ),
          getPinnedCurrencies: this.container.get<GetPinnedCurrenciesUseCase>(
            SERVICES.getPinnedCurrenciesUseCase,
          ),
        },
        callbacks,
      );
    }
    if (tab === 'tip') {
      return new TipCalculator(
        this.converterRegion,
        language,
        this.container.get<CalculateTipUseCase>(SERVICES.calculateTipUseCase),
        this.container.get<GetFavoritesUseCase>(SERVICES.getFavoritesUseCase),
      );
    }
    if (tab === 'size') {
      return new SizeConverter(
        this.converterRegion,
        language,
        this.container.get<ConvertSizeUseCase>(SERVICES.convertSizeUseCase),
        addToHistory,
        callbacks,
      );
    }

    const useCaseByTab: Record<
      Exclude<TabKey, 'currency' | 'size' | 'tip'>,
      | ConvertDistanceUseCase
      | ConvertWeightUseCase
      | ConvertVolumeUseCase
      | ConvertTemperatureUseCase
      | ConvertSpeedUseCase
    > = {
      distance: this.container.get(SERVICES.convertDistanceUseCase),
      weight: this.container.get(SERVICES.convertWeightUseCase),
      volume: this.container.get(SERVICES.convertVolumeUseCase),
      temperature: this.container.get(SERVICES.convertTemperatureUseCase),
      speed: this.container.get(SERVICES.convertSpeedUseCase),
    };

    return new UnitConverter(
      this.converterRegion,
      language,
      useCaseByTab[tab],
      addToHistory,
      UNIT_CONFIGS[tab],
      callbacks,
    );
  }
}
