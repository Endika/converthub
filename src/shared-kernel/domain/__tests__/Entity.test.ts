import { describe, expect, it } from 'vitest';
import { Entity } from '../Entity';

interface NameProps {
  name: string;
}

class User extends Entity<string, NameProps> {
  constructor(id: string, name: string) {
    super(id, { name });
  }
}

class Order extends Entity<string, NameProps> {
  constructor(id: string, name: string) {
    super(id, { name });
  }
}

describe('Entity', () => {
  it('is equal when ids match, regardless of props', () => {
    expect(new User('1', 'A').equals(new User('1', 'B'))).toBe(true);
  });

  it('is not equal when ids differ', () => {
    expect(new User('1', 'A').equals(new User('2', 'A'))).toBe(false);
  });

  it('is not equal to null or undefined', () => {
    const u = new User('1', 'A');
    expect(u.equals(null)).toBe(false);
    expect(u.equals(undefined)).toBe(false);
  });

  it('is not equal across different subclasses sharing the same id', () => {
    const u = new User('1', 'A');
    const o = new Order('1', 'A') as unknown as User;
    expect(u.equals(o)).toBe(false);
  });

  it('is equal to itself', () => {
    const u = new User('1', 'A');
    expect(u.equals(u)).toBe(true);
  });
});
