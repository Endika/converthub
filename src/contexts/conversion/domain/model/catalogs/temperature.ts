export const TEMPERATURE_UNITS = ['c', 'f', 'k'] as const;

export type TemperatureUnit = (typeof TEMPERATURE_UNITS)[number];

export const isTemperatureUnit = (raw: string): raw is TemperatureUnit =>
  (TEMPERATURE_UNITS as readonly string[]).includes(raw);

export const toKelvin = (value: number, unit: TemperatureUnit): number => {
  switch (unit) {
    case 'c':
      return value + 273.15;
    case 'f':
      return ((value - 32) * 5) / 9 + 273.15;
    case 'k':
      return value;
  }
};

export const fromKelvin = (kelvin: number, unit: TemperatureUnit): number => {
  switch (unit) {
    case 'c':
      return kelvin - 273.15;
    case 'f':
      return ((kelvin - 273.15) * 9) / 5 + 32;
    case 'k':
      return kelvin;
  }
};
