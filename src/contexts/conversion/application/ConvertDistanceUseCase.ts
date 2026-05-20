import {
  err,
  isErr,
  ok,
  type Result,
} from '../../../shared-kernel/domain/Result';
import { InvalidUnitError } from '../domain/errors/InvalidUnitError';
import { isDistanceUnit } from '../domain/model/catalogs/distance';
import { Distance, type DistanceError } from '../domain/model/Distance';
import type { ConvertDistancePort } from '../domain/ports/in/ConvertDistancePort';
import type { DistanceConversionService } from '../domain/services/DistanceConversionService';

export class ConvertDistanceUseCase implements ConvertDistancePort {
  constructor(private readonly service: DistanceConversionService) {}

  execute(
    value: number,
    from: string,
    to: string,
  ): Result<Distance, DistanceError> {
    const source = Distance.from(value, from);
    if (isErr(source)) return source;
    if (!isDistanceUnit(to)) {
      return err(new InvalidUnitError('distance', to));
    }
    return ok(this.service.convert(source.value, to));
  }
}
