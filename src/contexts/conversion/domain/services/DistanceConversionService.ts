import {
  DISTANCE_TO_METERS,
  type DistanceUnit,
} from '../model/catalogs/distance';
import { Distance } from '../model/Distance';

export class DistanceConversionService {
  convert(distance: Distance, to: DistanceUnit): Distance {
    if (distance.unit === to) return distance;
    const meters = distance.value * DISTANCE_TO_METERS[distance.unit];
    return Distance.fromTrusted(meters / DISTANCE_TO_METERS[to], to);
  }
}
