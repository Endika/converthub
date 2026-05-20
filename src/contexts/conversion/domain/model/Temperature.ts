import { err, ok, type Result } from '../../../../shared-kernel/domain/Result';
import { ValueObject } from '../../../../shared-kernel/domain/ValueObject';
import { InvalidAmountError } from '../errors/InvalidAmountError';
import { InvalidUnitError } from '../errors/InvalidUnitError';
import {
  isTemperatureUnit,
  type TemperatureUnit,
} from './catalogs/temperature';

interface TemperatureProps {
  value: number;
  unit: TemperatureUnit;
}

export type TemperatureError = InvalidAmountError | InvalidUnitError;

export class Temperature extends ValueObject<TemperatureProps> {
  private constructor(value: number, unit: TemperatureUnit) {
    super({ value, unit });
  }

  static from(
    value: number,
    unit: string,
  ): Result<Temperature, TemperatureError> {
    if (!Number.isFinite(value)) return err(new InvalidAmountError(value));
    if (!isTemperatureUnit(unit))
      return err(new InvalidUnitError('temperature', unit));
    return ok(new Temperature(value, unit));
  }

  static fromTrusted(value: number, unit: TemperatureUnit): Temperature {
    return new Temperature(value, unit);
  }

  get value(): number {
    return this.props.value;
  }

  get unit(): TemperatureUnit {
    return this.props.unit;
  }
}
