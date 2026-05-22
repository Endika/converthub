import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RateProvider } from '../../../../../contexts/exchange-rate/domain/model/RateProvider';
import type { RateProviderPreferencePort } from '../../../../../contexts/exchange-rate/domain/ports/out/RateProviderPreferencePort';
import { LanguageCode } from '../../../../../contexts/language/domain/model/LanguageCode';
import { LanguageService } from '../../../../../contexts/language/domain/services/LanguageService';
import { SettingsPanel } from '../SettingsPanel';

const buildPreference = (
  initial: RateProvider = 'exchangerate-api',
): RateProviderPreferencePort & { current: RateProvider } => {
  const ref = {
    current: initial,
    get: () => ref.current,
    set: (p: RateProvider) => {
      ref.current = p;
    },
  };
  return ref;
};

describe('SettingsPanel', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders one radio per rate provider with the current one checked', () => {
    const root = document.createElement('section');
    document.body.appendChild(root);
    const language = new LanguageService(LanguageCode.fromTrusted('en'));
    const preference = buildPreference('frankfurter');

    new SettingsPanel(root, language, preference);

    const radios = root.querySelectorAll<HTMLInputElement>(
      'input[name="rate-provider"]',
    );
    expect(radios).toHaveLength(2);
    const checked = root.querySelector<HTMLInputElement>(
      'input[name="rate-provider"]:checked',
    );
    expect(checked?.value).toBe('frankfurter');
  });

  it('persists the new provider and notifies the callback on change', () => {
    const root = document.createElement('section');
    document.body.appendChild(root);
    const language = new LanguageService(LanguageCode.fromTrusted('en'));
    const preference = buildPreference('exchangerate-api');
    const onProviderChange = vi.fn();

    new SettingsPanel(root, language, preference, { onProviderChange });

    const frank = root.querySelector<HTMLInputElement>(
      'input[name="rate-provider"][value="frankfurter"]',
    );
    if (frank === null) throw new Error('frankfurter radio missing');
    frank.checked = true;
    frank.dispatchEvent(new Event('change'));

    expect(preference.current).toBe('frankfurter');
    expect(onProviderChange).toHaveBeenCalledWith('frankfurter');
  });
});
