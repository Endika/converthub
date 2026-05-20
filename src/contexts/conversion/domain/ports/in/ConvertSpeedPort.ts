import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { Speed, SpeedError } from '../../model/Speed';

export interface ConvertSpeedPort {
  execute(value: number, from: string, to: string): Result<Speed, SpeedError>;
}
