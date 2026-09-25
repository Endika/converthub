import type { Result } from '../../../shared-kernel/domain/Result';
import type { StorageWriteError } from '../../../shared-kernel/domain/StorageWriteError';
import type { NotesFullError } from '../domain/errors/NotesFullError';
import type { TravelNote } from '../domain/model/TravelNote';
import type { AddNotePort } from '../domain/ports/in/AddNotePort';
import type { NotesService } from '../domain/services/NotesService';

export class AddNoteUseCase implements AddNotePort {
  constructor(private readonly service: NotesService) {}

  execute(note: TravelNote): Result<void, NotesFullError | StorageWriteError> {
    return this.service.add(note);
  }
}
