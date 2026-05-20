import type { TravelNote } from '../../model/TravelNote';

export interface NotesRepositoryPort {
  loadAll(): TravelNote[];
  saveAll(notes: readonly TravelNote[]): void;
}
