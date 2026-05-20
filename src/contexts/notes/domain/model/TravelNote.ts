import { Entity } from '../../../../shared-kernel/domain/Entity';

export interface TravelNoteProps {
  text: string;
  location: string | null;
  createdAt: Date;
}

export class TravelNote extends Entity<string, TravelNoteProps> {
  constructor(id: string, props: TravelNoteProps) {
    super(id, props);
  }

  static create(
    props: Omit<TravelNoteProps, 'createdAt'>,
    now: Date = new Date(),
  ): TravelNote {
    return new TravelNote(crypto.randomUUID(), { ...props, createdAt: now });
  }

  withText(text: string): TravelNote {
    return new TravelNote(this.id, { ...this.props, text });
  }

  get text(): string {
    return this.props.text;
  }

  get location(): string | null {
    return this.props.location;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
