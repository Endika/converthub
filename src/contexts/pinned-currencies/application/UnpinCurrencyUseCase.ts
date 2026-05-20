import type { UnpinCurrencyPort } from '../domain/ports/in/UnpinCurrencyPort';
import type { PinningService } from '../domain/services/PinningService';

export class UnpinCurrencyUseCase implements UnpinCurrencyPort {
  constructor(private readonly service: PinningService) {}

  execute(code: string): void {
    this.service.unpin(code);
  }
}
