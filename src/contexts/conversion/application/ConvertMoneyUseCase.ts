import { isErr, type Result } from '../../../shared-kernel/domain/Result';
import { CurrencyCode } from '../domain/model/CurrencyCode';
import { Money } from '../domain/model/Money';
import type {
  ConvertMoneyError,
  ConvertMoneyPort,
} from '../domain/ports/in/ConvertMoneyPort';
import type { MoneyConversionService } from '../domain/services/MoneyConversionService';

export class ConvertMoneyUseCase implements ConvertMoneyPort {
  constructor(private readonly service: MoneyConversionService) {}

  execute(
    amount: number,
    from: string,
    to: string,
  ): Result<Money, ConvertMoneyError> {
    const fromCurrency = CurrencyCode.from(from);
    if (isErr(fromCurrency)) return fromCurrency;
    const toCurrency = CurrencyCode.from(to);
    if (isErr(toCurrency)) return toCurrency;
    const money = Money.from(amount, fromCurrency.value);
    if (isErr(money)) return money;
    return this.service.convert(money.value, toCurrency.value);
  }
}
