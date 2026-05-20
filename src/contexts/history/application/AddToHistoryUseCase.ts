import type { ConversionEntry } from '../domain/model/ConversionEntry';
import type { AddToHistoryPort } from '../domain/ports/in/AddToHistoryPort';
import type { HistoryService } from '../domain/services/HistoryService';

export class AddToHistoryUseCase implements AddToHistoryPort {
  constructor(private readonly service: HistoryService) {}

  execute(entry: ConversionEntry): void {
    this.service.add(entry);
  }
}
