import type { AppData } from './data';

/** Where the app document lives. IndexedDB normally; memory when the browser blocks it. */
export interface Store {
  load(): Promise<AppData>;
  save(data: AppData): Promise<void>;
  clear(): Promise<void>;
}
