import { err, ok, type Result } from '../../../../shared-kernel/domain/Result';
import { ValueObject } from '../../../../shared-kernel/domain/ValueObject';
import { InvalidAmountError } from '../errors/InvalidAmountError';
import { InvalidUnitError } from '../errors/InvalidUnitError';
import { isDistanceUnit, type DistanceUnit } from './catalogs/distance';

interface DistanceProps {
  value: number;
  unit: DistanceUnit;
}

const isValidValue = (value: number): boolean =>
  Number.isFinite(value) && value >= 0;

export type DistanceError = InvalidAmountError | InvalidUnitError;

export class Distance extends ValueObject<DistanceProps> {
  private constructor(value: number, unit: DistanceUnit) {
    super({ value, unit });
  }

  static from(value: number, unit: string): Result<Distance, DistanceError> {
    if (!isValidValue(value)) return err(new InvalidAmountError(value));
    if (!isDistanceUnit(unit))
      return err(new InvalidUnitError('distance', unit));
    return ok(new Distance(value, unit));
  }

  static fromTrusted(value: number, unit: DistanceUnit): Distance {
    return new Distance(value, unit);
  }

  get value(): number {
    return this.props.value;
  }

  get unit(): DistanceUnit {
    return this.props.unit;
  }
}
