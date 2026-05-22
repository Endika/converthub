import type { RateProvider } from '../../model/RateProvider';

export interface RateProviderPreferencePort {
  get(): RateProvider;
  set(provider: RateProvider): void;
}
