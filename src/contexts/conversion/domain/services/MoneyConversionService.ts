import {
  isErr,
  ok,
  type Result,
} from '../../../../shared-kernel/domain/Result';
import type { InvalidAmountError } from '../errors/InvalidAmountError';
import type { RateNotAvailableError } from '../errors/RateNotAvailableError';
import type { CurrencyCode } from '../model/CurrencyCode';
import { Money } from '../model/Money';
import type { ExchangeRateProviderPort } from '../ports/out/ExchangeRateProviderPort';

export type MoneyConversionError = RateNotAvailableError | InvalidAmountError;

export class MoneyConversionService {
  constructor(private readonly rateProvider: ExchangeRateProviderPort) {}

  convert(
    money: Money,
    target: CurrencyCode,
  ): Result<Money, MoneyConversionError> {
    if (money.currency.equals(target)) return ok(money);
    const fromRate = this.rateProvider.getRate(money.currency);
    if (isErr(fromRate)) return fromRate;
    const toRate = this.rateProvider.getRate(target);
    if (isErr(toRate)) return toRate;
    const converted = (money.amount * toRate.value) / fromRate.value;
    return Money.from(converted, target);
  }
}
