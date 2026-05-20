import {
  err,
  isErr,
  ok,
  type Result,
} from '../../../shared-kernel/domain/Result';
import { InvalidUnitError } from '../domain/errors/InvalidUnitError';
import { isWeightUnit } from '../domain/model/catalogs/weight';
import { Weight, type WeightError } from '../domain/model/Weight';
import type { ConvertWeightPort } from '../domain/ports/in/ConvertWeightPort';
import type { WeightConversionService } from '../domain/services/WeightConversionService';

export class ConvertWeightUseCase implements ConvertWeightPort {
  constructor(private readonly service: WeightConversionService) {}

  execute(
    value: number,
    from: string,
    to: string,
  ): Result<Weight, WeightError> {
    const source = Weight.from(value, from);
    if (isErr(source)) return source;
    if (!isWeightUnit(to)) {
      return err(new InvalidUnitError('weight', to));
    }
    return ok(this.service.convert(source.value, to));
  }
}
