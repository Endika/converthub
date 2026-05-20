import type { TravelNote } from '../../model/TravelNote';

export interface GetNotesPort {
  execute(): readonly TravelNote[];
}
