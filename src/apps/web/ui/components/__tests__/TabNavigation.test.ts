import { beforeEach, describe, expect, it, vi } from 'vitest';
import { LanguageCode } from '../../../../../contexts/language/domain/model/LanguageCode';
import { LanguageService } from '../../../../../contexts/language/domain/services/LanguageService';
import { TabNavigation, type TabDefinition } from '../TabNavigation';

const TABS: readonly TabDefinition<'a' | 'b' | 'c'>[] = [
  { key: 'a', labelKey: 'nav_currencies' },
  { key: 'b', labelKey: 'nav_distance' },
  { key: 'c', labelKey: 'nav_weight' },
];

describe('TabNavigation', () => {
  let root: HTMLElement;
  let language: LanguageService;

  beforeEach(() => {
    root = document.createElement('div');
    language = new LanguageService(LanguageCode.fromTrusted('en'));
  });

  it('renders one button per tab and marks the initial as active', () => {
    new TabNavigation(root, language, TABS, { onChange: vi.fn() }, 'b');
    const buttons = root.querySelectorAll<HTMLButtonElement>('[data-tab]');
    expect(buttons).toHaveLength(3);
    expect(root.querySelector('.tab.is-active')?.getAttribute('data-tab')).toBe(
      'b',
    );
  });

  it('emits onChange and updates the active tab on click', () => {
    const onChange = vi.fn();
    new TabNavigation(root, language, TABS, { onChange }, 'a');
    root.querySelector<HTMLButtonElement>('[data-tab="c"]')?.click();
    expect(onChange).toHaveBeenCalledWith('c');
    expect(root.querySelector('.tab.is-active')?.getAttribute('data-tab')).toBe(
      'c',
    );
  });

  it('ignores clicks on the already active tab', () => {
    const onChange = vi.fn();
    new TabNavigation(root, language, TABS, { onChange }, 'a');
    root.querySelector<HTMLButtonElement>('[data-tab="a"]')?.click();
    expect(onChange).not.toHaveBeenCalled();
  });

  it('re-renders when language changes', () => {
    new TabNavigation(root, language, TABS, { onChange: vi.fn() }, 'a');
    const before = root.querySelector('[data-tab="a"]')?.textContent ?? '';
    language.change(LanguageCode.fromTrusted('es'));
    const after = root.querySelector('[data-tab="a"]')?.textContent ?? '';
    expect(after).not.toBe(before);
  });

  it('stops listening after destroy()', () => {
    const nav = new TabNavigation(
      root,
      language,
      TABS,
      { onChange: vi.fn() },
      'a',
    );
    nav.destroy();
    const before = root.innerHTML;
    language.change(LanguageCode.fromTrusted('es'));
    expect(root.innerHTML).toBe(before);
  });
});
