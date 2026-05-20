import { err, ok, type Result } from '../../../../shared-kernel/domain/Result';
import { ValueObject } from '../../../../shared-kernel/domain/ValueObject';
import { InvalidAmountError } from '../errors/InvalidAmountError';
import { InvalidUnitError } from '../errors/InvalidUnitError';
import { isWeightUnit, type WeightUnit } from './catalogs/weight';

interface WeightProps {
  value: number;
  unit: WeightUnit;
}

const isValidValue = (value: number): boolean =>
  Number.isFinite(value) && value >= 0;

export type WeightError = InvalidAmountError | InvalidUnitError;

export class Weight extends ValueObject<WeightProps> {
  private constructor(value: number, unit: WeightUnit) {
    super({ value, unit });
  }

  static from(value: number, unit: string): Result<Weight, WeightError> {
    if (!isValidValue(value)) return err(new InvalidAmountError(value));
    if (!isWeightUnit(unit)) return err(new InvalidUnitError('weight', unit));
    return ok(new Weight(value, unit));
  }

  static fromTrusted(value: number, unit: WeightUnit): Weight {
    return new Weight(value, unit);
  }

  get value(): number {
    return this.props.value;
  }

  get unit(): WeightUnit {
    return this.props.unit;
  }
}
