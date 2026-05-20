import { err, isErr, type Result } from '../../../shared-kernel/domain/Result';
import { InvalidUnitError } from '../domain/errors/InvalidUnitError';
import { isSizeRegion } from '../domain/model/catalogs/sizes';
import { Size } from '../domain/model/Size';
import type {
  ConvertSizeError,
  ConvertSizePort,
} from '../domain/ports/in/ConvertSizePort';
import type { SizeConversionService } from '../domain/services/SizeConversionService';

export class ConvertSizeUseCase implements ConvertSizePort {
  constructor(private readonly service: SizeConversionService) {}

  execute(
    label: string,
    category: string,
    fromRegion: string,
    toRegion: string,
  ): Result<Size, ConvertSizeError> {
    const source = Size.from(label, category, fromRegion);
    if (isErr(source)) return source;
    if (!isSizeRegion(toRegion)) {
      return err(new InvalidUnitError('size region', toRegion));
    }
    return this.service.convert(source.value, toRegion);
  }
}
