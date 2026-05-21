import { isOk } from '../../../../shared-kernel/domain/Result';
import type { ExchangeRateService } from '../../../exchange-rate/domain/services/ExchangeRateService';
import type { RateConverterPort } from '../../domain/ports/out/RateConverterPort';

export class ExchangeRateConverterAdapter implements RateConverterPort {
  constructor(private readonly rates: ExchangeRateService) {}

  convert(amount: number, from: string, to: string): number | null {
    if (from === to) return amount;
    const fromRate = this.rates.getRate(from);
    if (!isOk(fromRate)) return null;
    const toRate = this.rates.getRate(to);
    if (!isOk(toRate)) return null;
    return (amount * toRate.value) / fromRate.value;
  }
}
