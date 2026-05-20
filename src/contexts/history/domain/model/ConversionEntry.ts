import { Entity } from '../../../../shared-kernel/domain/Entity';

export const CONVERSION_TYPES = [
  'money',
  'distance',
  'weight',
  'volume',
  'temperature',
  'speed',
  'size',
] as const;

export type ConversionType = (typeof CONVERSION_TYPES)[number];

export interface ConversionEntryProps {
  type: ConversionType;
  fromValue: string;
  fromUnit: string;
  toValue: string;
  toUnit: string;
  timestamp: Date;
}

export class ConversionEntry extends Entity<string, ConversionEntryProps> {
  constructor(id: string, props: ConversionEntryProps) {
    super(id, props);
  }

  static create(
    props: Omit<ConversionEntryProps, 'timestamp'>,
    now: Date = new Date(),
  ): ConversionEntry {
    return new ConversionEntry(crypto.randomUUID(), { ...props, timestamp: now });
  }

  get type(): ConversionType {
    return this.props.type;
  }

  get fromValue(): string {
    return this.props.fromValue;
  }

  get fromUnit(): string {
    return this.props.fromUnit;
  }

  get toValue(): string {
    return this.props.toValue;
  }

  get toUnit(): string {
    return this.props.toUnit;
  }

  get timestamp(): Date {
    return this.props.timestamp;
  }
}
