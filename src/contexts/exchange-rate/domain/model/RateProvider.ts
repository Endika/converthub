export const RATE_PROVIDERS = [
  'exchangerate-api',
  'frankfurter',
  'open-er-api',
  'fawazahmed',
] as const;

export type RateProvider = (typeof RATE_PROVIDERS)[number];

export const DEFAULT_RATE_PROVIDER: RateProvider = 'exchangerate-api';

export const isRateProvider = (raw: string): raw is RateProvider =>
  (RATE_PROVIDERS as readonly string[]).includes(raw);
