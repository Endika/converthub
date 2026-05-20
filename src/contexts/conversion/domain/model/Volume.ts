import { err, ok, type Result } from '../../../../shared-kernel/domain/Result';
import { ValueObject } from '../../../../shared-kernel/domain/ValueObject';
import { InvalidAmountError } from '../errors/InvalidAmountError';
import { InvalidUnitError } from '../errors/InvalidUnitError';
import { isVolumeUnit, type VolumeUnit } from './catalogs/volume';

interface VolumeProps {
  value: number;
  unit: VolumeUnit;
}

const isValidValue = (value: number): boolean =>
  Number.isFinite(value) && value >= 0;

export type VolumeError = InvalidAmountError | InvalidUnitError;

export class Volume extends ValueObject<VolumeProps> {
  private constructor(value: number, unit: VolumeUnit) {
    super({ value, unit });
  }

  static from(value: number, unit: string): Result<Volume, VolumeError> {
    if (!isValidValue(value)) return err(new InvalidAmountError(value));
    if (!isVolumeUnit(unit)) return err(new InvalidUnitError('volume', unit));
    return ok(new Volume(value, unit));
  }

  static fromTrusted(value: number, unit: VolumeUnit): Volume {
    return new Volume(value, unit);
  }

  get value(): number {
    return this.props.value;
  }

  get unit(): VolumeUnit {
    return this.props.unit;
  }
}
