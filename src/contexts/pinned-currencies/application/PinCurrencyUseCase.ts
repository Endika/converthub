import type { Result } from '../../../shared-kernel/domain/Result';
import type { PinnedCurrenciesFullError } from '../domain/errors/PinnedCurrenciesFullError';
import type { PinCurrencyPort } from '../domain/ports/in/PinCurrencyPort';
import type { PinningService } from '../domain/services/PinningService';

export class PinCurrencyUseCase implements PinCurrencyPort {
  constructor(private readonly service: PinningService) {}

  execute(code: string): Result<void, PinnedCurrenciesFullError> {
    return this.service.pin(code);
  }
}
