const DEFAULTS: Readonly<Record<string, number>> = Object.freeze({
  USD: 18,
  CAD: 15,
  GBP: 12,
  MXN: 12,
  EUR: 10,
  AUD: 10,
  CHF: 10,
  BRL: 10,
  INR: 10,
  JPY: 0,
  CNY: 0,
  KRW: 0,
});

const FALLBACK_PERCENT = 10;

export const defaultTipFor = (currency: string): number => {
  const normalized = currency.toUpperCase();
  return DEFAULTS[normalized] ?? FALLBACK_PERCENT;
};
