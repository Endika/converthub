import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { InvalidSizeError } from '../../errors/InvalidSizeError';
import type { InvalidUnitError } from '../../errors/InvalidUnitError';
import type { Size } from '../../model/Size';

export type ConvertSizeError = InvalidUnitError | InvalidSizeError;

export interface ConvertSizePort {
  execute(
    label: string,
    category: string,
    fromRegion: string,
    toRegion: string,
  ): Result<Size, ConvertSizeError>;
}
