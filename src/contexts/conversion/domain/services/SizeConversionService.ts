import { err, ok, type Result } from '../../../../shared-kernel/domain/Result';
import { InvalidSizeError } from '../errors/InvalidSizeError';
import { SIZE_TABLES, type SizeRegion } from '../model/catalogs/sizes';
import { Size } from '../model/Size';

export class SizeConversionService {
  convert(size: Size, to: SizeRegion): Result<Size, InvalidSizeError> {
    if (size.region === to) return ok(size);
    const table = SIZE_TABLES[size.category];
    const row = table.find((r) => r[size.region] === size.label);
    if (row === undefined) {
      return err(new InvalidSizeError(size.category, size.region, size.label));
    }
    return ok(Size.fromTrusted(row[to], size.category, to));
  }
}
