import { WEIGHT_TO_GRAMS, type WeightUnit } from '../model/catalogs/weight';
import { Weight } from '../model/Weight';

export class WeightConversionService {
  convert(weight: Weight, to: WeightUnit): Weight {
    if (weight.unit === to) return weight;
    const grams = weight.value * WEIGHT_TO_GRAMS[weight.unit];
    return Weight.fromTrusted(grams / WEIGHT_TO_GRAMS[to], to);
  }
}
