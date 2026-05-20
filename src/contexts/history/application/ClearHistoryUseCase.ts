import type { ClearHistoryPort } from '../domain/ports/in/ClearHistoryPort';
import type { HistoryService } from '../domain/services/HistoryService';

export class ClearHistoryUseCase implements ClearHistoryPort {
  constructor(private readonly service: HistoryService) {}

  execute(): void {
    this.service.clear();
  }
}
