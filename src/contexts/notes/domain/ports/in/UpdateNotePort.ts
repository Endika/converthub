import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { NoteNotFoundError } from '../../errors/NoteNotFoundError';
import type { TravelNote } from '../../model/TravelNote';

export interface UpdateNotePort {
  execute(id: string, text: string): Result<TravelNote, NoteNotFoundError>;
}
