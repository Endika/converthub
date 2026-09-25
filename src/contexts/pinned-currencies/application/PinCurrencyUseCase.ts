import type { Result } from '../../../shared-kernel/domain/Result';
import type { StorageWriteError } from '../../../shared-kernel/domain/StorageWriteError';
import type { PinnedCurrenciesFullError } from '../domain/errors/PinnedCurrenciesFullError';
import type { PinCurrencyPort } from '../domain/ports/in/PinCurrencyPort';
import type { PinningService } from '../domain/services/PinningService';

export class PinCurrencyUseCase implements PinCurrencyPort {
  constructor(private readonly service: PinningService) {}

  execute(
    code: string,
  ): Result<void, PinnedCurrenciesFullError | StorageWriteError> {
    return this.service.pin(code);
  }
}
