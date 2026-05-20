import { err, ok, type Result } from '../../../../shared-kernel/domain/Result';
import { ValueObject } from '../../../../shared-kernel/domain/ValueObject';
import { InvalidAmountError } from '../errors/InvalidAmountError';
import { InvalidUnitError } from '../errors/InvalidUnitError';
import { isSpeedUnit, type SpeedUnit } from './catalogs/speed';

interface SpeedProps {
  value: number;
  unit: SpeedUnit;
}

const isValidValue = (value: number): boolean =>
  Number.isFinite(value) && value >= 0;

export type SpeedError = InvalidAmountError | InvalidUnitError;

export class Speed extends ValueObject<SpeedProps> {
  private constructor(value: number, unit: SpeedUnit) {
    super({ value, unit });
  }

  static from(value: number, unit: string): Result<Speed, SpeedError> {
    if (!isValidValue(value)) return err(new InvalidAmountError(value));
    if (!isSpeedUnit(unit)) return err(new InvalidUnitError('speed', unit));
    return ok(new Speed(value, unit));
  }

  static fromTrusted(value: number, unit: SpeedUnit): Speed {
    return new Speed(value, unit);
  }

  get value(): number {
    return this.props.value;
  }

  get unit(): SpeedUnit {
    return this.props.unit;
  }
}
