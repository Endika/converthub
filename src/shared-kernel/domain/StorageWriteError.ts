export class StorageWriteError extends Error {
  constructor() {
    super('Failed to write to storage');
    this.name = 'StorageWriteError';
  }
}
