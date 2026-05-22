import { ConvertDistanceUseCase } from '../../../contexts/conversion/application/ConvertDistanceUseCase';
import { ConvertMoneyUseCase } from '../../../contexts/conversion/application/ConvertMoneyUseCase';
import { ConvertSizeUseCase } from '../../../contexts/conversion/application/ConvertSizeUseCase';
import { ConvertSpeedUseCase } from '../../../contexts/conversion/application/ConvertSpeedUseCase';
import { ConvertTemperatureUseCase } from '../../../contexts/conversion/application/ConvertTemperatureUseCase';
import { ConvertVolumeUseCase } from '../../../contexts/conversion/application/ConvertVolumeUseCase';
import { ConvertWeightUseCase } from '../../../contexts/conversion/application/ConvertWeightUseCase';
import { DistanceConversionService } from '../../../contexts/conversion/domain/services/DistanceConversionService';
import { MoneyConversionService } from '../../../contexts/conversion/domain/services/MoneyConversionService';
import { SizeConversionService } from '../../../contexts/conversion/domain/services/SizeConversionService';
import { SpeedConversionService } from '../../../contexts/conversion/domain/services/SpeedConversionService';
import { TemperatureConversionService } from '../../../contexts/conversion/domain/services/TemperatureConversionService';
import { VolumeConversionService } from '../../../contexts/conversion/domain/services/VolumeConversionService';
import { WeightConversionService } from '../../../contexts/conversion/domain/services/WeightConversionService';
import { ExchangeRateProviderAdapter } from '../../../contexts/exchange-rate/application/ExchangeRateProviderAdapter';
import { GetExchangeRateUseCase } from '../../../contexts/exchange-rate/application/GetExchangeRateUseCase';
import { UpdateExchangeRatesUseCase } from '../../../contexts/exchange-rate/application/UpdateExchangeRatesUseCase';
import { ExchangeRateService } from '../../../contexts/exchange-rate/domain/services/ExchangeRateService';
import { ExchangeRateApiHttpAdapter } from '../../../contexts/exchange-rate/infrastructure/out/ExchangeRateApiHttpAdapter';
import { FrankfurterApiHttpAdapter } from '../../../contexts/exchange-rate/infrastructure/out/FrankfurterApiHttpAdapter';
import { LocalStorageExchangeRateRepository } from '../../../contexts/exchange-rate/infrastructure/out/LocalStorageExchangeRateRepository';
import { LocalStorageRateProviderPreference } from '../../../contexts/exchange-rate/infrastructure/out/LocalStorageRateProviderPreference';
import { SelectorExchangeRateApi } from '../../../contexts/exchange-rate/infrastructure/out/SelectorExchangeRateApi';
import { AddFavoriteUseCase } from '../../../contexts/favorites/application/AddFavoriteUseCase';
import { GetFavoritesUseCase } from '../../../contexts/favorites/application/GetFavoritesUseCase';
import { RemoveFavoriteUseCase } from '../../../contexts/favorites/application/RemoveFavoriteUseCase';
import { FavoritesService } from '../../../contexts/favorites/domain/services/FavoritesService';
import { LocalStorageFavoritesRepository } from '../../../contexts/favorites/infrastructure/out/LocalStorageFavoritesRepository';
import { AddToHistoryUseCase } from '../../../contexts/history/application/AddToHistoryUseCase';
import { ClearHistoryUseCase } from '../../../contexts/history/application/ClearHistoryUseCase';
import { GetHistoryUseCase } from '../../../contexts/history/application/GetHistoryUseCase';
import { HistoryService } from '../../../contexts/history/domain/services/HistoryService';
import { LocalStorageHistoryRepository } from '../../../contexts/history/infrastructure/out/LocalStorageHistoryRepository';
import { ChangeLanguageUseCase } from '../../../contexts/language/application/ChangeLanguageUseCase';
import { DetectBrowserLanguageUseCase } from '../../../contexts/language/application/DetectBrowserLanguageUseCase';
import { LanguageCode } from '../../../contexts/language/domain/model/LanguageCode';
import { LanguageService } from '../../../contexts/language/domain/services/LanguageService';
import { BrowserLanguageProvider } from '../../../contexts/language/infrastructure/out/BrowserLanguageProvider';
import { LocalStorageLanguageRepository } from '../../../contexts/language/infrastructure/out/LocalStorageLanguageRepository';
import { AddNoteUseCase } from '../../../contexts/notes/application/AddNoteUseCase';
import { DeleteNoteUseCase } from '../../../contexts/notes/application/DeleteNoteUseCase';
import { GetNotesUseCase } from '../../../contexts/notes/application/GetNotesUseCase';
import { UpdateNoteUseCase } from '../../../contexts/notes/application/UpdateNoteUseCase';
import { NotesService } from '../../../contexts/notes/domain/services/NotesService';
import { LocalStorageNotesRepository } from '../../../contexts/notes/infrastructure/out/LocalStorageNotesRepository';
import { GetPinnedCurrenciesUseCase } from '../../../contexts/pinned-currencies/application/GetPinnedCurrenciesUseCase';
import { PinCurrencyUseCase } from '../../../contexts/pinned-currencies/application/PinCurrencyUseCase';
import { UnpinCurrencyUseCase } from '../../../contexts/pinned-currencies/application/UnpinCurrencyUseCase';
import { PinningService } from '../../../contexts/pinned-currencies/domain/services/PinningService';
import { LocalStoragePinnedCurrenciesRepository } from '../../../contexts/pinned-currencies/infrastructure/out/LocalStoragePinnedCurrenciesRepository';
import { CalculateTipUseCase } from '../../../contexts/tipping/application/CalculateTipUseCase';
import { TipCalculator } from '../../../contexts/tipping/domain/services/TipCalculator';
import { ExchangeRateConverterAdapter } from '../../../contexts/tipping/infrastructure/out/ExchangeRateConverterAdapter';
import { ConsoleLogger } from '../../../shared-infrastructure/logging/ConsoleLogger';
import { Container } from './Container';

export const SERVICES = {
  logger: 'logger',
  // language
  languageRepository: 'languageRepository',
  browserLanguageProvider: 'browserLanguageProvider',
  languageService: 'languageService',
  changeLanguageUseCase: 'changeLanguageUseCase',
  detectBrowserLanguageUseCase: 'detectBrowserLanguageUseCase',
  // exchange-rate
  exchangeRateRepository: 'exchangeRateRepository',
  exchangeRateApi: 'exchangeRateApi',
  rateProviderPreference: 'rateProviderPreference',
  exchangeRateService: 'exchangeRateService',
  updateExchangeRatesUseCase: 'updateExchangeRatesUseCase',
  getExchangeRateUseCase: 'getExchangeRateUseCase',
  exchangeRateProvider: 'exchangeRateProvider',
  // conversion services
  moneyConversionService: 'moneyConversionService',
  distanceConversionService: 'distanceConversionService',
  weightConversionService: 'weightConversionService',
  volumeConversionService: 'volumeConversionService',
  temperatureConversionService: 'temperatureConversionService',
  speedConversionService: 'speedConversionService',
  sizeConversionService: 'sizeConversionService',
  // conversion use cases
  convertMoneyUseCase: 'convertMoneyUseCase',
  convertDistanceUseCase: 'convertDistanceUseCase',
  convertWeightUseCase: 'convertWeightUseCase',
  convertVolumeUseCase: 'convertVolumeUseCase',
  convertTemperatureUseCase: 'convertTemperatureUseCase',
  convertSpeedUseCase: 'convertSpeedUseCase',
  convertSizeUseCase: 'convertSizeUseCase',
  // history
  historyRepository: 'historyRepository',
  historyService: 'historyService',
  addToHistoryUseCase: 'addToHistoryUseCase',
  getHistoryUseCase: 'getHistoryUseCase',
  clearHistoryUseCase: 'clearHistoryUseCase',
  // favorites
  favoritesRepository: 'favoritesRepository',
  favoritesService: 'favoritesService',
  addFavoriteUseCase: 'addFavoriteUseCase',
  removeFavoriteUseCase: 'removeFavoriteUseCase',
  getFavoritesUseCase: 'getFavoritesUseCase',
  // notes
  notesRepository: 'notesRepository',
  notesService: 'notesService',
  addNoteUseCase: 'addNoteUseCase',
  updateNoteUseCase: 'updateNoteUseCase',
  deleteNoteUseCase: 'deleteNoteUseCase',
  getNotesUseCase: 'getNotesUseCase',
  // pinned currencies
  pinnedCurrenciesRepository: 'pinnedCurrenciesRepository',
  pinningService: 'pinningService',
  pinCurrencyUseCase: 'pinCurrencyUseCase',
  unpinCurrencyUseCase: 'unpinCurrencyUseCase',
  getPinnedCurrenciesUseCase: 'getPinnedCurrenciesUseCase',
  // tipping
  tipCalculator: 'tipCalculator',
  rateConverter: 'rateConverter',
  calculateTipUseCase: 'calculateTipUseCase',
} as const;

const resolveInitialLanguage = (c: Container): LanguageCode => {
  const repo = c.get<LocalStorageLanguageRepository>(
    SERVICES.languageRepository,
  );
  const saved = repo.load();
  if (saved !== null) return LanguageCode.fromTrusted(saved);
  const detector = c.get<DetectBrowserLanguageUseCase>(
    SERVICES.detectBrowserLanguageUseCase,
  );
  return detector.execute();
};

export const buildContainer = (): Container => {
  const c = new Container();

  c.registerSingleton(SERVICES.logger, () => new ConsoleLogger());

  // language
  c.registerSingleton(
    SERVICES.languageRepository,
    () => new LocalStorageLanguageRepository(),
  );
  c.registerSingleton(
    SERVICES.browserLanguageProvider,
    () => new BrowserLanguageProvider(),
  );
  c.registerSingleton(
    SERVICES.detectBrowserLanguageUseCase,
    () =>
      new DetectBrowserLanguageUseCase(c.get(SERVICES.browserLanguageProvider)),
  );
  c.registerSingleton(
    SERVICES.languageService,
    () => new LanguageService(resolveInitialLanguage(c)),
  );
  c.registerSingleton(
    SERVICES.changeLanguageUseCase,
    () =>
      new ChangeLanguageUseCase(
        c.get(SERVICES.languageService),
        c.get(SERVICES.languageRepository),
      ),
  );

  // exchange-rate
  c.registerSingleton(
    SERVICES.exchangeRateRepository,
    () => new LocalStorageExchangeRateRepository(),
  );
  c.registerSingleton(
    SERVICES.rateProviderPreference,
    () => new LocalStorageRateProviderPreference(),
  );
  c.registerSingleton(
    SERVICES.exchangeRateApi,
    () =>
      new SelectorExchangeRateApi(
        {
          'exchangerate-api': new ExchangeRateApiHttpAdapter(),
          frankfurter: new FrankfurterApiHttpAdapter(),
        },
        c.get(SERVICES.rateProviderPreference),
      ),
  );
  c.registerSingleton(
    SERVICES.exchangeRateService,
    () => new ExchangeRateService(c.get(SERVICES.exchangeRateRepository)),
  );
  c.registerSingleton(
    SERVICES.updateExchangeRatesUseCase,
    () =>
      new UpdateExchangeRatesUseCase(
        c.get(SERVICES.exchangeRateApi),
        c.get(SERVICES.exchangeRateRepository),
        c.get(SERVICES.logger),
      ),
  );
  c.registerSingleton(
    SERVICES.getExchangeRateUseCase,
    () => new GetExchangeRateUseCase(c.get(SERVICES.exchangeRateService)),
  );
  c.registerSingleton(
    SERVICES.exchangeRateProvider,
    () =>
      new ExchangeRateProviderAdapter(c.get(SERVICES.getExchangeRateUseCase)),
  );

  // conversion services
  c.registerSingleton(
    SERVICES.moneyConversionService,
    () => new MoneyConversionService(c.get(SERVICES.exchangeRateProvider)),
  );
  c.registerSingleton(
    SERVICES.distanceConversionService,
    () => new DistanceConversionService(),
  );
  c.registerSingleton(
    SERVICES.weightConversionService,
    () => new WeightConversionService(),
  );
  c.registerSingleton(
    SERVICES.volumeConversionService,
    () => new VolumeConversionService(),
  );
  c.registerSingleton(
    SERVICES.temperatureConversionService,
    () => new TemperatureConversionService(),
  );
  c.registerSingleton(
    SERVICES.speedConversionService,
    () => new SpeedConversionService(),
  );
  c.registerSingleton(
    SERVICES.sizeConversionService,
    () => new SizeConversionService(),
  );

  // conversion use cases
  c.registerSingleton(
    SERVICES.convertMoneyUseCase,
    () => new ConvertMoneyUseCase(c.get(SERVICES.moneyConversionService)),
  );
  c.registerSingleton(
    SERVICES.convertDistanceUseCase,
    () => new ConvertDistanceUseCase(c.get(SERVICES.distanceConversionService)),
  );
  c.registerSingleton(
    SERVICES.convertWeightUseCase,
    () => new ConvertWeightUseCase(c.get(SERVICES.weightConversionService)),
  );
  c.registerSingleton(
    SERVICES.convertVolumeUseCase,
    () => new ConvertVolumeUseCase(c.get(SERVICES.volumeConversionService)),
  );
  c.registerSingleton(
    SERVICES.convertTemperatureUseCase,
    () =>
      new ConvertTemperatureUseCase(
        c.get(SERVICES.temperatureConversionService),
      ),
  );
  c.registerSingleton(
    SERVICES.convertSpeedUseCase,
    () => new ConvertSpeedUseCase(c.get(SERVICES.speedConversionService)),
  );
  c.registerSingleton(
    SERVICES.convertSizeUseCase,
    () => new ConvertSizeUseCase(c.get(SERVICES.sizeConversionService)),
  );

  // history
  c.registerSingleton(
    SERVICES.historyRepository,
    () => new LocalStorageHistoryRepository(),
  );
  c.registerSingleton(
    SERVICES.historyService,
    () => new HistoryService(c.get(SERVICES.historyRepository)),
  );
  c.registerSingleton(
    SERVICES.addToHistoryUseCase,
    () => new AddToHistoryUseCase(c.get(SERVICES.historyService)),
  );
  c.registerSingleton(
    SERVICES.getHistoryUseCase,
    () => new GetHistoryUseCase(c.get(SERVICES.historyService)),
  );
  c.registerSingleton(
    SERVICES.clearHistoryUseCase,
    () => new ClearHistoryUseCase(c.get(SERVICES.historyService)),
  );

  // favorites
  c.registerSingleton(
    SERVICES.favoritesRepository,
    () => new LocalStorageFavoritesRepository(),
  );
  c.registerSingleton(
    SERVICES.favoritesService,
    () => new FavoritesService(c.get(SERVICES.favoritesRepository)),
  );
  c.registerSingleton(
    SERVICES.addFavoriteUseCase,
    () => new AddFavoriteUseCase(c.get(SERVICES.favoritesService)),
  );
  c.registerSingleton(
    SERVICES.removeFavoriteUseCase,
    () => new RemoveFavoriteUseCase(c.get(SERVICES.favoritesService)),
  );
  c.registerSingleton(
    SERVICES.getFavoritesUseCase,
    () => new GetFavoritesUseCase(c.get(SERVICES.favoritesService)),
  );

  // notes
  c.registerSingleton(
    SERVICES.notesRepository,
    () => new LocalStorageNotesRepository(),
  );
  c.registerSingleton(
    SERVICES.notesService,
    () => new NotesService(c.get(SERVICES.notesRepository)),
  );
  c.registerSingleton(
    SERVICES.addNoteUseCase,
    () => new AddNoteUseCase(c.get(SERVICES.notesService)),
  );
  c.registerSingleton(
    SERVICES.updateNoteUseCase,
    () => new UpdateNoteUseCase(c.get(SERVICES.notesService)),
  );
  c.registerSingleton(
    SERVICES.deleteNoteUseCase,
    () => new DeleteNoteUseCase(c.get(SERVICES.notesService)),
  );
  c.registerSingleton(
    SERVICES.getNotesUseCase,
    () => new GetNotesUseCase(c.get(SERVICES.notesService)),
  );

  // pinned currencies
  c.registerSingleton(
    SERVICES.pinnedCurrenciesRepository,
    () => new LocalStoragePinnedCurrenciesRepository(),
  );
  c.registerSingleton(
    SERVICES.pinningService,
    () => new PinningService(c.get(SERVICES.pinnedCurrenciesRepository)),
  );
  c.registerSingleton(
    SERVICES.pinCurrencyUseCase,
    () => new PinCurrencyUseCase(c.get(SERVICES.pinningService)),
  );
  c.registerSingleton(
    SERVICES.unpinCurrencyUseCase,
    () => new UnpinCurrencyUseCase(c.get(SERVICES.pinningService)),
  );
  c.registerSingleton(
    SERVICES.getPinnedCurrenciesUseCase,
    () => new GetPinnedCurrenciesUseCase(c.get(SERVICES.pinningService)),
  );

  // tipping
  c.registerSingleton(SERVICES.tipCalculator, () => new TipCalculator());
  c.registerSingleton(
    SERVICES.rateConverter,
    () => new ExchangeRateConverterAdapter(c.get(SERVICES.exchangeRateService)),
  );
  c.registerSingleton(
    SERVICES.calculateTipUseCase,
    () =>
      new CalculateTipUseCase(
        c.get(SERVICES.tipCalculator),
        c.get(SERVICES.rateConverter),
      ),
  );

  return c;
};
