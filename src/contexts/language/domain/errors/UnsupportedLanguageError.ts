export class UnsupportedLanguageError extends Error {
  readonly code: string;

  constructor(code: string) {
    super(`Unsupported language: ${code}`);
    this.name = 'UnsupportedLanguageError';
    this.code = code;
  }
}
