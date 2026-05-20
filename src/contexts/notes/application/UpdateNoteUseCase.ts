import type { Result } from '../../../shared-kernel/domain/Result';
import type { NoteNotFoundError } from '../domain/errors/NoteNotFoundError';
import type { TravelNote } from '../domain/model/TravelNote';
import type { UpdateNotePort } from '../domain/ports/in/UpdateNotePort';
import type { NotesService } from '../domain/services/NotesService';

export class UpdateNoteUseCase implements UpdateNotePort {
  constructor(private readonly service: NotesService) {}

  execute(id: string, text: string): Result<TravelNote, NoteNotFoundError> {
    return this.service.update(id, text);
  }
}
