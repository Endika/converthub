import { err, ok, type Result } from '../../../../shared-kernel/domain/Result';
import { ValueObject } from '../../../../shared-kernel/domain/ValueObject';
import { InvalidCurrencyError } from '../errors/InvalidCurrencyError';
import {
  isCurrencyCodeString,
  type CurrencyCodeString,
} from './catalogs/currencies';

interface CurrencyCodeProps {
  code: CurrencyCodeString;
}

export class CurrencyCode extends ValueObject<CurrencyCodeProps> {
  private constructor(code: CurrencyCodeString) {
    super({ code });
  }

  static from(raw: string): Result<CurrencyCode, InvalidCurrencyError> {
    const normalized = raw.toUpperCase();
    if (!isCurrencyCodeString(normalized)) {
      return err(new InvalidCurrencyError(raw));
    }
    return ok(new CurrencyCode(normalized));
  }

  static fromTrusted(code: CurrencyCodeString): CurrencyCode {
    return new CurrencyCode(code);
  }

  get value(): CurrencyCodeString {
    return this.props.code;
  }

  override toString(): string {
    return this.props.code;
  }
}
