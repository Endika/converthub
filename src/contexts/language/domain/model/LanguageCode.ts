import { ValueObject } from '../../../../shared-kernel/domain/ValueObject';
import { err, ok, type Result } from '../../../../shared-kernel/domain/Result';
import { UnsupportedLanguageError } from '../errors/UnsupportedLanguageError';

export const SUPPORTED_LANGUAGES = ['en', 'es', 'eu'] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

interface LanguageCodeProps {
  code: SupportedLanguage;
}

const isSupported = (raw: string): raw is SupportedLanguage =>
  (SUPPORTED_LANGUAGES as readonly string[]).includes(raw);

export class LanguageCode extends ValueObject<LanguageCodeProps> {
  private constructor(code: SupportedLanguage) {
    super({ code });
  }

  static from(raw: string): Result<LanguageCode, UnsupportedLanguageError> {
    const normalized = raw.toLowerCase();
    if (!isSupported(normalized)) {
      return err(new UnsupportedLanguageError(raw));
    }
    return ok(new LanguageCode(normalized));
  }

  static fromTrusted(code: SupportedLanguage): LanguageCode {
    return new LanguageCode(code);
  }

  get value(): SupportedLanguage {
    return this.props.code;
  }

  override toString(): string {
    return this.props.code;
  }
}
