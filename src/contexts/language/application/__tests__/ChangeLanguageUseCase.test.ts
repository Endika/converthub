import { describe, expect, it, vi } from 'vitest';
import { isErr, isOk } from '../../../../shared-kernel/domain/Result';
import { UnsupportedLanguageError } from '../../domain/errors/UnsupportedLanguageError';
import { LanguageCode } from '../../domain/model/LanguageCode';
import type { LanguageRepositoryPort } from '../../domain/ports/out/LanguageRepositoryPort';
import { LanguageService } from '../../domain/services/LanguageService';
import { ChangeLanguageUseCase } from '../ChangeLanguageUseCase';

const buildRepo = (): LanguageRepositoryPort => ({
  load: vi.fn(),
  save: vi.fn(),
});

describe('ChangeLanguageUseCase', () => {
  it('updates the service and persists when code is supported', () => {
    const service = new LanguageService(LanguageCode.fromTrusted('en'));
    const repo = buildRepo();
    const useCase = new ChangeLanguageUseCase(service, repo);

    const result = useCase.execute('es');

    expect(isOk(result)).toBe(true);
    expect(service.getCurrent().value).toBe('es');
    expect(repo.save).toHaveBeenCalledWith('es');
  });

  it('returns Err and does not touch state when code is unsupported', () => {
    const service = new LanguageService(LanguageCode.fromTrusted('en'));
    const repo = buildRepo();
    const useCase = new ChangeLanguageUseCase(service, repo);

    const result = useCase.execute('fr');

    expect(isErr(result)).toBe(true);
    if (isErr(result)) {
      expect(result.error).toBeInstanceOf(UnsupportedLanguageError);
    }
    expect(service.getCurrent().value).toBe('en');
    expect(repo.save).not.toHaveBeenCalled();
  });
});
