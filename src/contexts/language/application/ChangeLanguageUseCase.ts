import {
  isErr,
  ok,
  type Result,
} from '../../../shared-kernel/domain/Result';
import type { UnsupportedLanguageError } from '../domain/errors/UnsupportedLanguageError';
import { LanguageCode } from '../domain/model/LanguageCode';
import type { ChangeLanguagePort } from '../domain/ports/in/ChangeLanguagePort';
import type { LanguageRepositoryPort } from '../domain/ports/out/LanguageRepositoryPort';
import type { LanguageService } from '../domain/services/LanguageService';

export class ChangeLanguageUseCase implements ChangeLanguagePort {
  constructor(
    private readonly service: LanguageService,
    private readonly repository: LanguageRepositoryPort,
  ) {}

  execute(code: string): Result<void, UnsupportedLanguageError> {
    const parsed = LanguageCode.from(code);
    if (isErr(parsed)) return parsed;
    this.service.change(parsed.value);
    this.repository.save(parsed.value.value);
    return ok(undefined);
  }
}
