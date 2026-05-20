import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { Distance, DistanceError } from '../../model/Distance';

export interface ConvertDistancePort {
  execute(
    value: number,
    from: string,
    to: string,
  ): Result<Distance, DistanceError>;
}
