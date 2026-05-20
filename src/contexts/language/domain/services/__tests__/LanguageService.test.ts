import { describe, expect, it, vi } from 'vitest';
import { LanguageCode } from '../../model/LanguageCode';
import { LanguageService } from '../LanguageService';

const EN = LanguageCode.fromTrusted('en');
const ES = LanguageCode.fromTrusted('es');
const EU = LanguageCode.fromTrusted('eu');

describe('LanguageService', () => {
  it('reports the initial language', () => {
    expect(new LanguageService(EN).getCurrent().value).toBe('en');
  });

  it('updates current language on change', () => {
    const svc = new LanguageService(EN);
    svc.change(ES);
    expect(svc.getCurrent().value).toBe('es');
  });

  it('notifies listeners on change with previous and current', () => {
    const svc = new LanguageService(EN);
    const listener = vi.fn();
    svc.onChange(listener);
    svc.change(ES);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({ previous: EN, current: ES });
  });

  it('does not notify when changing to the same language', () => {
    const svc = new LanguageService(EN);
    const listener = vi.fn();
    svc.onChange(listener);
    svc.change(LanguageCode.fromTrusted('en'));
    expect(listener).not.toHaveBeenCalled();
  });

  it('returns translation for current language', () => {
    const svc = new LanguageService(EN);
    expect(svc.translate('common_save')).toBe('Save');
    svc.change(ES);
    expect(svc.translate('common_save')).toBe('Guardar');
    svc.change(EU);
    expect(svc.translate('common_save')).toBe('Gorde');
  });

  it('unsubscribes a listener via the returned disposer', () => {
    const svc = new LanguageService(EN);
    const listener = vi.fn();
    const off = svc.onChange(listener);
    off();
    svc.change(ES);
    expect(listener).not.toHaveBeenCalled();
  });

  it('isolates listener errors without breaking other listeners', () => {
    const svc = new LanguageService(EN);
    const ok1 = vi.fn();
    const ok2 = vi.fn();
    svc.onChange(ok1);
    svc.onChange(ok2);
    svc.change(ES);
    expect(ok1).toHaveBeenCalled();
    expect(ok2).toHaveBeenCalled();
  });
});
