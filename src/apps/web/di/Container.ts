type Factory<T> = () => T;

interface Entry<T> {
  factory: Factory<T>;
  instance: T | null;
}

export class Container {
  private readonly entries = new Map<string, Entry<unknown>>();

  registerSingleton<T>(key: string, factory: Factory<T>): void {
    this.entries.set(key, { factory, instance: null });
  }

  get<T>(key: string): T {
    const entry = this.entries.get(key);
    if (entry === undefined) {
      throw new Error(`Service not registered: ${key}`);
    }
    if (entry.instance === null) {
      entry.instance = entry.factory();
    }
    return entry.instance as T;
  }

  has(key: string): boolean {
    return this.entries.has(key);
  }
}
