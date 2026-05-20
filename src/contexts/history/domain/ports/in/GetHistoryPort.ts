import type { ConversionEntry } from '../../model/ConversionEntry';

export interface GetHistoryPort {
  execute(): readonly ConversionEntry[];
}
