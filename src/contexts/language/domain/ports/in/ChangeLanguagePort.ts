import type { Result } from '../../../../../shared-kernel/domain/Result';
import type { UnsupportedLanguageError } from '../../errors/UnsupportedLanguageError';

export interface ChangeLanguagePort {
  execute(code: string): Result<void, UnsupportedLanguageError>;
}
