import type { ConversionEntry } from '../domain/model/ConversionEntry';
import type { GetHistoryPort } from '../domain/ports/in/GetHistoryPort';
import type { HistoryService } from '../domain/services/HistoryService';

export class GetHistoryUseCase implements GetHistoryPort {
  constructor(private readonly service: HistoryService) {}

  execute(): readonly ConversionEntry[] {
    return this.service.list();
  }
}
