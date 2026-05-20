import { err, ok, type Result } from '../../../../shared-kernel/domain/Result';
import { ValueObject } from '../../../../shared-kernel/domain/ValueObject';
import { InvalidUnitError } from '../errors/InvalidUnitError';
import {
  isSizeCategory,
  isSizeRegion,
  type SizeCategory,
  type SizeRegion,
} from './catalogs/sizes';

interface SizeProps {
  label: string;
  category: SizeCategory;
  region: SizeRegion;
}

export class Size extends ValueObject<SizeProps> {
  private constructor(label: string, category: SizeCategory, region: SizeRegion) {
    super({ label, category, region });
  }

  static from(
    label: string,
    category: string,
    region: string,
  ): Result<Size, InvalidUnitError> {
    if (!isSizeCategory(category)) {
      return err(new InvalidUnitError('size category', category));
    }
    if (!isSizeRegion(region)) {
      return err(new InvalidUnitError('size region', region));
    }
    return ok(new Size(label, category, region));
  }

  static fromTrusted(
    label: string,
    category: SizeCategory,
    region: SizeRegion,
  ): Size {
    return new Size(label, category, region);
  }

  get label(): string {
    return this.props.label;
  }

  get category(): SizeCategory {
    return this.props.category;
  }

  get region(): SizeRegion {
    return this.props.region;
  }
}
