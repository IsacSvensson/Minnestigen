import { IndexedDbStore } from './idb';
import { MemoryStore } from './memory';
import type { Store } from './Store';

export * from './data';
export * from './persist';
export type { Store } from './Store';
export { IndexedDbStore, openMinnesDb, DB_NAME, MIGRATIONS } from './idb';
export { MemoryStore } from './memory';

export interface OpenedStore {
  store: Store;
  /** `memory` means nothing survives a reload (IndexedDB blocked, e.g. some private modes). */
  kind: 'indexeddb' | 'memory';
}

export async function createStore(): Promise<OpenedStore> {
  try {
    if (typeof indexedDB === 'undefined') throw new Error('IndexedDB saknas');
    return { store: await IndexedDbStore.open(), kind: 'indexeddb' };
  } catch {
    return { store: new MemoryStore(), kind: 'memory' };
  }
}
