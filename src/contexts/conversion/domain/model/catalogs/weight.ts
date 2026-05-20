export const WEIGHT_UNITS = ['kg', 'g', 'mg', 'lb', 'oz', 'st', 't'] as const;

export type WeightUnit = (typeof WEIGHT_UNITS)[number];

export const WEIGHT_TO_GRAMS: Record<WeightUnit, number> = {
  kg: 1000,
  g: 1,
  mg: 0.001,
  lb: 453.59237,
  oz: 28.349523125,
  st: 6350.29318,
  t: 1_000_000,
};

export const isWeightUnit = (raw: string): raw is WeightUnit =>
  (WEIGHT_UNITS as readonly string[]).includes(raw);
