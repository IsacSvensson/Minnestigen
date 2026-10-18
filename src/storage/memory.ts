import { emptyData, type AppData } from './data';
import type { Store } from './Store';

/** Fallback when IndexedDB is blocked (some private modes): nothing survives a reload. */
export class MemoryStore implements Store {
  private data: AppData = emptyData();

  async load(): Promise<AppData> {
    return structuredClone(this.data);
  }

  async save(data: AppData): Promise<void> {
    this.data = structuredClone(data);
  }

  async clear(): Promise<void> {
    this.data = emptyData();
  }
}
