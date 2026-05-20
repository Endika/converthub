import { SPEED_TO_MS, type SpeedUnit } from '../model/catalogs/speed';
import { Speed } from '../model/Speed';

export class SpeedConversionService {
  convert(speed: Speed, to: SpeedUnit): Speed {
    if (speed.unit === to) return speed;
    const ms = speed.value * SPEED_TO_MS[speed.unit];
    return Speed.fromTrusted(ms / SPEED_TO_MS[to], to);
  }
}
