import { describe, expect, it } from 'vitest';
import { DomainEvent } from '../DomainEvent';

class UserCreated extends DomainEvent {
  readonly eventName = 'user.created';
}

describe('DomainEvent', () => {
  it('assigns a unique eventId per instance', () => {
    const a = new UserCreated('agg-1');
    const b = new UserCreated('agg-1');
    expect(a.eventId).not.toBe(b.eventId);
  });

  it('captures occurredOn within the construction window', () => {
    const before = Date.now();
    const evt = new UserCreated('a');
    const after = Date.now();
    expect(evt.occurredOn.getTime()).toBeGreaterThanOrEqual(before);
    expect(evt.occurredOn.getTime()).toBeLessThanOrEqual(after);
  });
});
