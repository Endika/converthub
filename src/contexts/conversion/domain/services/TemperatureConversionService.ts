import {
  fromKelvin,
  toKelvin,
  type TemperatureUnit,
} from '../model/catalogs/temperature';
import { Temperature } from '../model/Temperature';

export class TemperatureConversionService {
  convert(temperature: Temperature, to: TemperatureUnit): Temperature {
    if (temperature.unit === to) return temperature;
    const kelvin = toKelvin(temperature.value, temperature.unit);
    return Temperature.fromTrusted(fromKelvin(kelvin, to), to);
  }
}
