import type { PinnedCurrency } from '../domain/model/PinnedCurrency';
import type { GetPinnedCurrenciesPort } from '../domain/ports/in/GetPinnedCurrenciesPort';
import type { PinningService } from '../domain/services/PinningService';

export class GetPinnedCurrenciesUseCase implements GetPinnedCurrenciesPort {
  constructor(private readonly service: PinningService) {}

  execute(): readonly PinnedCurrency[] {
    return this.service.list();
  }
}
