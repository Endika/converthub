import {
  DEFAULT_RATE_PROVIDER,
  isRateProvider,
  type RateProvider,
} from '../../domain/model/RateProvider';
import type { RateProviderPreferencePort } from '../../domain/ports/out/RateProviderPreferencePort';

const STORAGE_KEY = 'converthub.rateProvider';

export class LocalStorageRateProviderPreference implements RateProviderPreferencePort {
  get(): RateProvider {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw !== null && isRateProvider(raw)) return raw;
    } catch {
      /* localStorage unavailable, fall through */
    }
    return DEFAULT_RATE_PROVIDER;
  }

  set(provider: RateProvider): void {
    try {
      localStorage.setItem(STORAGE_KEY, provider);
    } catch {
      /* localStorage unavailable, ignore */
    }
  }
}
