export const SPEED_UNITS = ['kmh', 'mph', 'ms', 'kn'] as const;

export type SpeedUnit = (typeof SPEED_UNITS)[number];

export const SPEED_TO_MS: Record<SpeedUnit, number> = {
  kmh: 1000 / 3600,
  mph: 1609.344 / 3600,
  ms: 1,
  kn: 1852 / 3600,
};

export const isSpeedUnit = (raw: string): raw is SpeedUnit =>
  (SPEED_UNITS as readonly string[]).includes(raw);
