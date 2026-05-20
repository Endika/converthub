import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { Volume, VolumeError } from '../../model/Volume';

export interface ConvertVolumePort {
  execute(value: number, from: string, to: string): Result<Volume, VolumeError>;
}
