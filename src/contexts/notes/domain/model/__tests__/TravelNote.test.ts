import { describe, expect, it } from 'vitest';
import { TravelNote } from '../TravelNote';

describe('TravelNote', () => {
  it('creates a note with generated id and createdAt', () => {
    const n = TravelNote.create({ text: 'coffee 4.50€', location: 'Paris' });
    expect(n.id).toMatch(/^[0-9a-f-]{36}$/i);
    expect(n.text).toBe('coffee 4.50€');
    expect(n.location).toBe('Paris');
    expect(n.createdAt).toBeInstanceOf(Date);
  });

  it('accepts null location', () => {
    const n = TravelNote.create({ text: 'note', location: null });
    expect(n.location).toBeNull();
  });

  it('withText returns a copy with updated text and same id', () => {
    const n = TravelNote.create({ text: 'old', location: null });
    const updated = n.withText('new');
    expect(updated.id).toBe(n.id);
    expect(updated.text).toBe('new');
    expect(n.text).toBe('old');
  });
});
