import type { DomainEvent } from './DomainEvent';
import { Entity } from './Entity';

export abstract class AggregateRoot<
  TId,
  TProps extends object,
> extends Entity<TId, TProps> {
  private domainEvents: DomainEvent[] = [];

  protected addEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  pullEvents(): readonly DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }

  hasPendingEvents(): boolean {
    return this.domainEvents.length > 0;
  }
}
