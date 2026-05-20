import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { NotesFullError } from '../../errors/NotesFullError';
import type { TravelNote } from '../../model/TravelNote';

export interface AddNotePort {
  execute(note: TravelNote): Result<void, NotesFullError>;
}
