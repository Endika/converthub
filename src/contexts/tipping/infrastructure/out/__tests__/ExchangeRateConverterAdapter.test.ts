import { describe, expect, it } from 'vitest';
import { ExchangeRateSnapshot } from '../../../../exchange-rate/domain/model/ExchangeRateSnapshot';
import type { ExchangeRateRepositoryPort } from '../../../../exchange-rate/domain/ports/out/ExchangeRateRepositoryPort';
import { ExchangeRateService } from '../../../../exchange-rate/domain/services/ExchangeRateService';
import { ExchangeRateConverterAdapter } from '../ExchangeRateConverterAdapter';

class InMemoryRateRepo implements ExchangeRateRepositoryPort {
  constructor(private readonly snapshot: ExchangeRateSnapshot | null) {}
  load(): ExchangeRateSnapshot | null {
    return this.snapshot;
  }
  save(): void {
    // no-op for tests
  }
}

const makeAdapter = (
  snapshot: ExchangeRateSnapshot | null,
): ExchangeRateConverterAdapter =>
  new ExchangeRateConverterAdapter(
    new ExchangeRateService(new InMemoryRateRepo(snapshot)),
  );

describe('ExchangeRateConverterAdapter', () => {
  it('returns the same amount when from === to', () => {
    const adapter = makeAdapter(null);
    expect(adapter.convert(40, 'EUR', 'EUR')).toBe(40);
  });

  it('converts using the rate ratio when both currencies are in the snapshot', () => {
    const snap = new ExchangeRateSnapshot(
      'USD',
      { USD: 1, EUR: 0.91 },
      new Date(),
    );
    const adapter = makeAdapter(snap);
    const result = adapter.convert(44, 'EUR', 'USD');
    expect(result).not.toBeNull();
    expect(result as number).toBeCloseTo(44 / 0.91, 4);
  });

  it('returns null when the source currency is missing from the snapshot', () => {
    const snap = new ExchangeRateSnapshot(
      'USD',
      { USD: 1, EUR: 0.91 },
      new Date(),
    );
    const adapter = makeAdapter(snap);
    expect(adapter.convert(10, 'XYZ', 'USD')).toBeNull();
  });

  it('returns null when the target currency is missing from the snapshot', () => {
    const snap = new ExchangeRateSnapshot(
      'USD',
      { USD: 1, EUR: 0.91 },
      new Date(),
    );
    const adapter = makeAdapter(snap);
    expect(adapter.convert(10, 'USD', 'XYZ')).toBeNull();
  });

  it('returns null when no snapshot is cached', () => {
    const adapter = makeAdapter(null);
    expect(adapter.convert(10, 'USD', 'EUR')).toBeNull();
  });
});
