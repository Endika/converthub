import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { StorageWriteError } from '../../../../../shared-kernel/domain/StorageWriteError';
import type { PinnedCurrenciesFullError } from '../../errors/PinnedCurrenciesFullError';

export interface PinCurrencyPort {
  execute(
    code: string,
  ): Result<void, PinnedCurrenciesFullError | StorageWriteError>;
}
