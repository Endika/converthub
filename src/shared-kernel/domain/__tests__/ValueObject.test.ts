import { describe, expect, it } from 'vitest';
import { ValueObject } from '../ValueObject';

interface PriceProps {
  amount: number;
  currency: string;
}

class Price extends ValueObject<PriceProps> {
  constructor(amount: number, currency: string) {
    super({ amount, currency });
  }
}

class Discount extends ValueObject<PriceProps> {
  constructor(amount: number, currency: string) {
    super({ amount, currency });
  }
}

interface OfferProps {
  price: Price;
  tag: string;
}

class Offer extends ValueObject<OfferProps> {
  constructor(price: Price, tag: string) {
    super({ price, tag });
  }
}

describe('ValueObject', () => {
  it('is equal when every prop matches', () => {
    expect(new Price(10, 'EUR').equals(new Price(10, 'EUR'))).toBe(true);
  });

  it('is not equal when any prop differs', () => {
    expect(new Price(10, 'EUR').equals(new Price(11, 'EUR'))).toBe(false);
    expect(new Price(10, 'EUR').equals(new Price(10, 'USD'))).toBe(false);
  });

  it('is not equal to null or undefined', () => {
    const p = new Price(10, 'EUR');
    expect(p.equals(null)).toBe(false);
    expect(p.equals(undefined)).toBe(false);
  });

  it('is not equal across different subclasses with identical shape', () => {
    const price = new Price(10, 'EUR');
    const discount = new Discount(10, 'EUR') as unknown as Price;
    expect(price.equals(discount)).toBe(false);
  });

  it('is equal to itself', () => {
    const p = new Price(10, 'EUR');
    expect(p.equals(p)).toBe(true);
  });

  it('freezes props so they cannot be mutated externally', () => {
    const p = new Price(10, 'EUR') as unknown as { props: PriceProps };
    expect(() => {
      p.props.amount = 99;
    }).toThrow();
  });

  it('compares nested ValueObjects by value', () => {
    const a = new Offer(new Price(10, 'EUR'), 'sale');
    const b = new Offer(new Price(10, 'EUR'), 'sale');
    expect(a.equals(b)).toBe(true);
  });

  it('is not equal when nested ValueObjects differ', () => {
    const a = new Offer(new Price(10, 'EUR'), 'sale');
    const b = new Offer(new Price(11, 'EUR'), 'sale');
    expect(a.equals(b)).toBe(false);
  });
});
