import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { Weight, WeightError } from '../../model/Weight';

export interface ConvertWeightPort {
  execute(value: number, from: string, to: string): Result<Weight, WeightError>;
}
