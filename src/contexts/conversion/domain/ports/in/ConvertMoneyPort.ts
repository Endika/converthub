import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { InvalidCurrencyError } from '../../errors/InvalidCurrencyError';
import type { Money } from '../../model/Money';
import type { MoneyConversionError } from '../../services/MoneyConversionService';

export type ConvertMoneyError = InvalidCurrencyError | MoneyConversionError;

export interface ConvertMoneyPort {
  execute(
    amount: number,
    from: string,
    to: string,
  ): Result<Money, ConvertMoneyError>;
}
