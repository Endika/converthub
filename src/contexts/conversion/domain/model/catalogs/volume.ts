export const VOLUME_UNITS = [
  'l',
  'ml',
  'gal_us',
  'gal_uk',
  'floz_us',
  'floz_uk',
  'cup_us',
  'pt_us',
] as const;

export type VolumeUnit = (typeof VOLUME_UNITS)[number];

export const VOLUME_TO_MILLILITERS: Record<VolumeUnit, number> = {
  l: 1000,
  ml: 1,
  gal_us: 3785.411784,
  gal_uk: 4546.09,
  floz_us: 29.5735295625,
  floz_uk: 28.4130625,
  cup_us: 236.5882365,
  pt_us: 473.176473,
};

export const isVolumeUnit = (raw: string): raw is VolumeUnit =>
  (VOLUME_UNITS as readonly string[]).includes(raw);
