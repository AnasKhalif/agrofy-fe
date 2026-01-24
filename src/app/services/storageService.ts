/**
 * Storage Service
 * Type-safe localStorage wrapper with automatic JSON serialization
 */

class StorageService {
  private readonly storage: Storage = localStorage;

  /** Get item from storage with automatic JSON parsing */
  get<T>(key: string): T | null {
    const item = this.storage.getItem(key);
    if (!item) return null;

    try {
      return JSON.parse(item) as T;
    } catch {
      // If not JSON, return as string (covers simple string values)
      return item as T;
    }
  }

  /** Set item in storage with automatic JSON serialization */
  set<T>(key: string, value: T): void {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    this.storage.setItem(key, serialized);
  }

  /** Remove item from storage */
  remove(key: string): void {
    this.storage.removeItem(key);
  }

  /** Check if key exists in storage */
  has(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }

  /** Clear all items from storage */
  clear(): void {
    this.storage.clear();
  }
}

export const storageService = new StorageService();
export default storageService;
