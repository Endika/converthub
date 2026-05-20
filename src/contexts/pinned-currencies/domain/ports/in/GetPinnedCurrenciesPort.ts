import type { PinnedCurrency } from '../../model/PinnedCurrency';

export interface GetPinnedCurrenciesPort {
  execute(): readonly PinnedCurrency[];
}
