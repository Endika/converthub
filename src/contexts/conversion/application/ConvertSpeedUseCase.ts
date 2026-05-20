import {
  err,
  isErr,
  ok,
  type Result,
} from '../../../shared-kernel/domain/Result';
import { InvalidUnitError } from '../domain/errors/InvalidUnitError';
import { isSpeedUnit } from '../domain/model/catalogs/speed';
import { Speed, type SpeedError } from '../domain/model/Speed';
import type { ConvertSpeedPort } from '../domain/ports/in/ConvertSpeedPort';
import type { SpeedConversionService } from '../domain/services/SpeedConversionService';

export class ConvertSpeedUseCase implements ConvertSpeedPort {
  constructor(private readonly service: SpeedConversionService) {}

  execute(
    value: number,
    from: string,
    to: string,
  ): Result<Speed, SpeedError> {
    const source = Speed.from(value, from);
    if (isErr(source)) return source;
    if (!isSpeedUnit(to)) {
      return err(new InvalidUnitError('speed', to));
    }
    return ok(this.service.convert(source.value, to));
  }
}
