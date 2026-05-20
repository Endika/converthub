import {
  err,
  isErr,
  ok,
  type Result,
} from '../../../shared-kernel/domain/Result';
import { InvalidUnitError } from '../domain/errors/InvalidUnitError';
import { isTemperatureUnit } from '../domain/model/catalogs/temperature';
import {
  Temperature,
  type TemperatureError,
} from '../domain/model/Temperature';
import type { ConvertTemperaturePort } from '../domain/ports/in/ConvertTemperaturePort';
import type { TemperatureConversionService } from '../domain/services/TemperatureConversionService';

export class ConvertTemperatureUseCase implements ConvertTemperaturePort {
  constructor(private readonly service: TemperatureConversionService) {}

  execute(
    value: number,
    from: string,
    to: string,
  ): Result<Temperature, TemperatureError> {
    const source = Temperature.from(value, from);
    if (isErr(source)) return source;
    if (!isTemperatureUnit(to)) {
      return err(new InvalidUnitError('temperature', to));
    }
    return ok(this.service.convert(source.value, to));
  }
}
