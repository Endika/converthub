import type { DeleteNotePort } from '../domain/ports/in/DeleteNotePort';
import type { NotesService } from '../domain/services/NotesService';

export class DeleteNoteUseCase implements DeleteNotePort {
  constructor(private readonly service: NotesService) {}

  execute(id: string): void {
    this.service.remove(id);
  }
}
