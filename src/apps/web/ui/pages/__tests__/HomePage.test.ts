import { describe, expect, it } from 'vitest';
import { buildContainer } from '../../../di/setup';
import { HomePage } from '../HomePage';

describe('HomePage', () => {
  it('mounts language selector, converter and side panel regions', () => {
    const root = document.createElement('div');
    new HomePage(root, buildContainer());
    expect(root.querySelector('[data-region="language"]')).not.toBeNull();
    expect(root.querySelector('[data-region="converter"]')).not.toBeNull();
    expect(root.querySelector('[data-region="side"]')).not.toBeNull();
    expect(root.querySelectorAll('[data-side-tab]')).toHaveLength(3);
    expect(root.querySelectorAll('[data-lang]')).toHaveLength(3);
  });

  it('refreshes the history list when a conversion is submitted', () => {
    localStorage.removeItem('converthub:history');
    localStorage.setItem(
      'converthub:rates',
      JSON.stringify({
        base: 'USD',
        rates: { USD: 1, EUR: 0.92 },
        fetchedAt: Date.now(),
      }),
    );
    const root = document.createElement('div');
    new HomePage(root, buildContainer());

    const converter = root.querySelector<HTMLElement>(
      '[data-region="converter"]',
    );
    if (converter === null) throw new Error('converter region missing');
    const amount = converter.querySelector<HTMLInputElement>(
      'input[name="amount"]',
    );
    if (amount === null) throw new Error('amount input missing');
    amount.value = '100';
    converter
      .querySelector('form')
      ?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));

    const items = root.querySelectorAll('.entry-list__item');
    expect(items.length).toBeGreaterThan(0);
    localStorage.removeItem('converthub:history');
    localStorage.removeItem('converthub:rates');
  });

  it('renders tabs for every conversion category', () => {
    const root = document.createElement('div');
    new HomePage(root, buildContainer());
    const tabs = root.querySelectorAll<HTMLButtonElement>('[data-tab]');
    const keys = Array.from(tabs).map((t) => t.dataset['tab']);
    expect(keys).toEqual([
      'currency',
      'distance',
      'weight',
      'volume',
      'temperature',
      'speed',
      'size',
      'tip',
    ]);
  });

  it.each([
    ['distance', 'select[name="from"]'],
    ['weight', 'select[name="from"]'],
    ['volume', 'select[name="from"]'],
    ['temperature', 'select[name="from"]'],
    ['speed', 'select[name="from"]'],
    ['size', 'select[name="category"]'],
  ])('swaps the converter when clicking tab "%s"', (tab, selector) => {
    const root = document.createElement('div');
    new HomePage(root, buildContainer());
    root.querySelector<HTMLButtonElement>(`[data-tab="${tab}"]`)?.click();
    const converter = root.querySelector<HTMLElement>(
      '[data-region="converter"]',
    );
    expect(converter?.querySelector(selector)).not.toBeNull();
  });

  it('throws when the layout regions are missing', () => {
    const root = document.createElement('div');
    const original = root.querySelector.bind(root);
    // Stub querySelector to simulate missing regions
    Object.defineProperty(root, 'querySelector', {
      value: (selector: string) => {
        if (selector.includes('region=')) return null;
        return original(selector);
      },
    });
    expect(() => new HomePage(root, buildContainer())).toThrow(/regions/);
  });
});
