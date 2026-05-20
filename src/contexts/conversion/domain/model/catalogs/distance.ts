export const DISTANCE_UNITS = [
  'km',
  'm',
  'cm',
  'mm',
  'mi',
  'ft',
  'yd',
  'nmi',
] as const;

export type DistanceUnit = (typeof DISTANCE_UNITS)[number];

export const DISTANCE_TO_METERS: Record<DistanceUnit, number> = {
  km: 1000,
  m: 1,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.344,
  ft: 0.3048,
  yd: 0.9144,
  nmi: 1852,
};

export const isDistanceUnit = (raw: string): raw is DistanceUnit =>
  (DISTANCE_UNITS as readonly string[]).includes(raw);
