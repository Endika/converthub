import {
  err,
  isErr,
  ok,
  type Result,
} from '../../../shared-kernel/domain/Result';
import { InvalidUnitError } from '../domain/errors/InvalidUnitError';
import { isVolumeUnit } from '../domain/model/catalogs/volume';
import { Volume, type VolumeError } from '../domain/model/Volume';
import type { ConvertVolumePort } from '../domain/ports/in/ConvertVolumePort';
import type { VolumeConversionService } from '../domain/services/VolumeConversionService';

export class ConvertVolumeUseCase implements ConvertVolumePort {
  constructor(private readonly service: VolumeConversionService) {}

  execute(
    value: number,
    from: string,
    to: string,
  ): Result<Volume, VolumeError> {
    const source = Volume.from(value, from);
    if (isErr(source)) return source;
    if (!isVolumeUnit(to)) {
      return err(new InvalidUnitError('volume', to));
    }
    return ok(this.service.convert(source.value, to));
  }
}
