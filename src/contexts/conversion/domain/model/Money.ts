import { err, ok, type Result } from '../../../../shared-kernel/domain/Result';
import { ValueObject } from '../../../../shared-kernel/domain/ValueObject';
import { InvalidAmountError } from '../errors/InvalidAmountError';
import type { CurrencyCode } from './CurrencyCode';

interface MoneyProps {
  amount: number;
  currency: CurrencyCode;
}

const isValidAmount = (amount: number): boolean =>
  Number.isFinite(amount) && amount >= 0;

export class Money extends ValueObject<MoneyProps> {
  private constructor(amount: number, currency: CurrencyCode) {
    super({ amount, currency });
  }

  static from(
    amount: number,
    currency: CurrencyCode,
  ): Result<Money, InvalidAmountError> {
    if (!isValidAmount(amount)) {
      return err(new InvalidAmountError(amount));
    }
    return ok(new Money(amount, currency));
  }

  static fromTrusted(amount: number, currency: CurrencyCode): Money {
    return new Money(amount, currency);
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): CurrencyCode {
    return this.props.currency;
  }
}
