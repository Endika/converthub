import {
  VOLUME_TO_MILLILITERS,
  type VolumeUnit,
} from '../model/catalogs/volume';
import { Volume } from '../model/Volume';

export class VolumeConversionService {
  convert(volume: Volume, to: VolumeUnit): Volume {
    if (volume.unit === to) return volume;
    const millis = volume.value * VOLUME_TO_MILLILITERS[volume.unit];
    return Volume.fromTrusted(millis / VOLUME_TO_MILLILITERS[to], to);
  }
}
