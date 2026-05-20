import type { Result } from '../../../../../shared-kernel/domain/Result';
import type {
  Temperature,
  TemperatureError,
} from '../../model/Temperature';

export interface ConvertTemperaturePort {
  execute(
    value: number,
    from: string,
    to: string,
  ): Result<Temperature, TemperatureError>;
}
