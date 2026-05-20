export const SUPPORTED_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CNY', 'CHF', 'CAD', 'AUD', 'NZD', 'SGD',
  'HKD', 'KRW', 'INR', 'BRL', 'MXN', 'ARS', 'CLP', 'COP', 'PEN', 'UYU',
  'SEK', 'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK', 'ISK',
  'RUB', 'UAH', 'TRY', 'ILS', 'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR',
  'EGP', 'ZAR', 'NGN', 'KES', 'MAD', 'TND', 'GHS', 'TWD', 'THB', 'IDR',
  'MYR', 'PHP', 'VND', 'PKR', 'BDT', 'LKR', 'NPR',
] as const;

export type CurrencyCodeString = (typeof SUPPORTED_CURRENCIES)[number];

export const isCurrencyCodeString = (raw: string): raw is CurrencyCodeString =>
  (SUPPORTED_CURRENCIES as readonly string[]).includes(raw);
