import type { ConversionEntry } from '../../model/ConversionEntry';

export interface AddToHistoryPort {
  execute(entry: ConversionEntry): void;
}
