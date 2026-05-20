import type { TravelNote } from '../domain/model/TravelNote';
import type { GetNotesPort } from '../domain/ports/in/GetNotesPort';
import type { NotesService } from '../domain/services/NotesService';

export class GetNotesUseCase implements GetNotesPort {
  constructor(private readonly service: NotesService) {}

  execute(): readonly TravelNote[] {
    return this.service.list();
  }
}
