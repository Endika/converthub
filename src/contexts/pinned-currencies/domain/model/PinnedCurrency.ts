import { Entity } from '../../../../shared-kernel/domain/Entity';

interface PinnedCurrencyProps {
  pinnedAt: Date;
}

export class PinnedCurrency extends Entity<string, PinnedCurrencyProps> {
  constructor(code: string, pinnedAt: Date = new Date()) {
    super(code, { pinnedAt });
  }

  get code(): string {
    return this.id;
  }

  get pinnedAt(): Date {
    return this.props.pinnedAt;
  }
}
