import { describe, expect, it, vi } from 'vitest';
import { LanguageCode } from '../../../../../contexts/language/domain/model/LanguageCode';
import { LanguageService } from '../../../../../contexts/language/domain/services/LanguageService';
import { SidePanel } from '../SidePanel';

describe('SidePanel', () => {
  it('renders three tabs and marks the initial as active', () => {
    const root = document.createElement('div');
    const language = new LanguageService(LanguageCode.fromTrusted('en'));
    new SidePanel(root, language, { onChange: vi.fn() }, 'favorites');
    const tabs = root.querySelectorAll<HTMLButtonElement>('[data-side-tab]');
    expect(Array.from(tabs).map((t) => t.dataset['sideTab'])).toEqual([
      'history',
      'favorites',
      'notes',
    ]);
    expect(
      root.querySelector('.is-active')?.getAttribute('data-side-tab'),
    ).toBe('favorites');
  });

  it('emits onChange and updates the active tab on click', () => {
    const root = document.createElement('div');
    const language = new LanguageService(LanguageCode.fromTrusted('en'));
    const onChange = vi.fn();
    new SidePanel(root, language, { onChange }, 'history');
    root.querySelector<HTMLButtonElement>('[data-side-tab="notes"]')?.click();
    expect(onChange).toHaveBeenCalledWith('notes');
    expect(
      root.querySelector('.is-active')?.getAttribute('data-side-tab'),
    ).toBe('notes');
  });

  it('exposes a content region for the active list', () => {
    const root = document.createElement('div');
    const language = new LanguageService(LanguageCode.fromTrusted('en'));
    const panel = new SidePanel(root, language, { onChange: vi.fn() });
    expect(panel.contentRegion()).toBe(
      root.querySelector('[data-region="content"]'),
    );
  });
});
