import type { AddNoteUseCase } from '../../../../contexts/notes/application/AddNoteUseCase';
import type { DeleteNoteUseCase } from '../../../../contexts/notes/application/DeleteNoteUseCase';
import type { GetNotesUseCase } from '../../../../contexts/notes/application/GetNotesUseCase';
import type { UpdateNoteUseCase } from '../../../../contexts/notes/application/UpdateNoteUseCase';
import { TravelNote } from '../../../../contexts/notes/domain/model/TravelNote';
import type { LanguageService } from '../../../../contexts/language/domain/services/LanguageService';
import type { TranslationKey } from '../../../../contexts/language/domain/translations/Translations';
import { isErr } from '../../../../shared-kernel/domain/Result';

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export class NotesList {
  private readonly unsubscribe: () => void;
  private editingId: string | null = null;

  constructor(
    private readonly root: HTMLElement,
    private readonly languageService: LanguageService,
    private readonly getNotesUseCase: GetNotesUseCase,
    private readonly addNoteUseCase: AddNoteUseCase,
    private readonly updateNoteUseCase: UpdateNoteUseCase,
    private readonly deleteNoteUseCase: DeleteNoteUseCase,
  ) {
    this.render();
    this.unsubscribe = this.languageService.onChange(() => this.render());
  }

  destroy(): void {
    this.unsubscribe();
  }

  refresh(): void {
    this.render();
  }

  private render(): void {
    const t = (k: TranslationKey): string => this.languageService.translate(k);
    const items = this.getNotesUseCase.execute();
    const body =
      items.length === 0
        ? `<p class="entry-list__empty">${t('notes_empty')}</p>`
        : `<ul class="entry-list">${items
            .map((n) => this.renderItem(n, t))
            .join('')}</ul>`;

    this.root.innerHTML = `
      <h2 class="entry-list__title">${t('nav_notes')}</h2>
      <form class="note-form" data-action="add" novalidate>
        <input type="text" name="text" placeholder="${t('note_text_placeholder')}" required />
        <input type="text" name="location" placeholder="${t('note_location_placeholder')}" />
        <button type="submit" class="btn btn--primary btn--small">${t('common_save')}</button>
        <span class="note-form__error" data-region="error"></span>
      </form>
      ${body}
    `;

    this.attachAddForm(t);
    this.attachItemActions(t);
  }

  private renderItem(n: TravelNote, t: (k: TranslationKey) => string): string {
    const isEditing = this.editingId === n.id;
    const location = n.location ?? '';
    if (isEditing) {
      return `
        <li class="entry-list__item entry-list__item--editing" data-id="${escapeHtml(n.id)}">
          <form class="note-form note-form--inline" data-action="update" novalidate>
            <input type="text" name="text" value="${escapeHtml(n.text)}" required />
            <button type="submit" class="btn btn--primary btn--small">${t('common_save')}</button>
            <button type="button" class="btn btn--ghost btn--small" data-action="cancel">×</button>
          </form>
        </li>
      `;
    }
    return `
      <li class="entry-list__item" data-id="${escapeHtml(n.id)}">
        <span class="entry-list__primary">${escapeHtml(n.text)}</span>
        <span class="entry-list__secondary">${escapeHtml(location)}</span>
        <button type="button" class="btn btn--ghost btn--icon" data-action="edit" aria-label="edit">
          ✎
        </button>
        <button type="button" class="btn btn--ghost btn--icon" data-action="remove" aria-label="${t('common_delete')}">
          ×
        </button>
      </li>
    `;
  }

  private attachAddForm(t: (k: TranslationKey) => string): void {
    const form = this.root.querySelector<HTMLFormElement>(
      'form[data-action="add"]',
    );
    if (form === null) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const textInput = form.elements.namedItem('text') as HTMLInputElement;
      const locInput = form.elements.namedItem('location') as HTMLInputElement;
      const text = textInput.value.trim();
      if (text === '') return;
      const location = locInput.value.trim();
      const result = this.addNoteUseCase.execute(
        TravelNote.create({
          text,
          location: location === '' ? null : location,
        }),
      );
      if (isErr(result)) {
        const errorEl = this.root.querySelector<HTMLElement>(
          '[data-region="error"]',
        );
        if (errorEl !== null) errorEl.textContent = t('notes_full');
        return;
      }
      this.render();
    });
  }

  private attachItemActions(t: (k: TranslationKey) => string): void {
    this.root
      .querySelectorAll<HTMLButtonElement>(
        '[data-action="edit"], [data-action="remove"], [data-action="cancel"]',
      )
      .forEach((btn) => {
        const action = btn.dataset['action'];
        const id = btn.closest<HTMLElement>('[data-id]')?.dataset['id'];
        if (id === undefined || action === undefined) return;
        btn.addEventListener('click', () => {
          if (action === 'remove') {
            this.deleteNoteUseCase.execute(id);
          } else if (action === 'edit') {
            this.editingId = id;
          } else if (action === 'cancel') {
            this.editingId = null;
          }
          this.render();
        });
      });

    this.root
      .querySelectorAll<HTMLFormElement>('form[data-action="update"]')
      .forEach((form) => {
        const id = form.closest<HTMLElement>('[data-id]')?.dataset['id'];
        if (id === undefined) return;
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const input = form.elements.namedItem('text') as HTMLInputElement;
          const text = input.value.trim();
          if (text === '') return;
          this.updateNoteUseCase.execute(id, text);
          this.editingId = null;
          this.render();
        });
      });

    // Touch `t` to avoid unused param warning when there are no items.
    void t;
  }
}
