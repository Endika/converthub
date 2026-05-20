import { Entity } from '../../../../shared-kernel/domain/Entity';

export const FAVORITE_TYPES = [
  'money',
  'distance',
  'weight',
  'volume',
  'temperature',
  'speed',
  'size',
] as const;

export type FavoriteType = (typeof FAVORITE_TYPES)[number];

export interface FavoriteProps {
  type: FavoriteType;
  fromUnit: string;
  toUnit: string;
  label: string;
  amount: number | null;
  createdAt: Date;
}

export class Favorite extends Entity<string, FavoriteProps> {
  constructor(id: string, props: FavoriteProps) {
    super(id, props);
  }

  static create(
    props: Omit<FavoriteProps, 'createdAt' | 'amount'> & {
      amount?: number | null;
    },
    now: Date = new Date(),
  ): Favorite {
    return new Favorite(crypto.randomUUID(), {
      ...props,
      amount: props.amount ?? null,
      createdAt: now,
    });
  }

  get type(): FavoriteType {
    return this.props.type;
  }

  get fromUnit(): string {
    return this.props.fromUnit;
  }

  get toUnit(): string {
    return this.props.toUnit;
  }

  get label(): string {
    return this.props.label;
  }

  get amount(): number | null {
    return this.props.amount;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
