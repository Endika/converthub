import { describe, expect, it } from 'vitest';
import { AggregateRoot } from '../AggregateRoot';
import { DomainEvent } from '../DomainEvent';

class UserCreated extends DomainEvent {
  readonly eventName = 'user.created';
}

class UserGreeted extends DomainEvent {
  readonly eventName = 'user.greeted';
}

class User extends AggregateRoot<string, { name: string }> {
  constructor(id: string, name: string) {
    super(id, { name });
    this.addEvent(new UserCreated(id));
  }

  greet(): void {
    this.addEvent(new UserGreeted(this.id));
  }
}

describe('AggregateRoot', () => {
  it('accumulates events emitted during its lifecycle', () => {
    const u = new User('1', 'A');
    u.greet();
    expect(u.hasPendingEvents()).toBe(true);
  });

  it('drains events on pullEvents and exposes them in order', () => {
    const u = new User('1', 'A');
    u.greet();
    const events = u.pullEvents();
    expect(events).toHaveLength(2);
    expect(events[0]).toBeInstanceOf(UserCreated);
    expect(events[1]).toBeInstanceOf(UserGreeted);
  });

  it('clears the queue after pulling events', () => {
    const u = new User('1', 'A');
    u.pullEvents();
    expect(u.hasPendingEvents()).toBe(false);
    expect(u.pullEvents()).toEqual([]);
  });
});
