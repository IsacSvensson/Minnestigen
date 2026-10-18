import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import { normalize, type AppData } from './data';
import type { Store } from './Store';

// Mattedalen shares the origin (isacsvensson.github.io): the name must stay different.
export const DB_NAME = 'minnesstigen';
const KEY = 'app';

export interface MinnesDB extends DBSchema {
  state: { key: string; value: AppData };
}

export type Migration = (db: IDBPDatabase<MinnesDB>) => void;

/**
 * Schema migrations, indexed by the version they upgrade *to*. Never edit a
 * released migration; append a new one and the database version follows.
 */
export const MIGRATIONS: Migration[] = [
  // v1: one document with everything
  (db) => {
    db.createObjectStore('state');
  },
];

export async function openMinnesDb(name = DB_NAME): Promise<IDBPDatabase<MinnesDB>> {
  const db: IDBPDatabase<MinnesDB> = await openDB<MinnesDB>(name, MIGRATIONS.length, {
    upgrade(upgradeDb, oldVersion) {
      for (let v = oldVersion; v < MIGRATIONS.length; v++) MIGRATIONS[v]?.(upgradeDb);
    },
    blocking() {
      // A newer version of the app (another tab) wants to upgrade: let it.
      db.close();
    },
  });
  return db;
}

export class IndexedDbStore implements Store {
  constructor(private readonly db: IDBPDatabase<MinnesDB>) {}

  static async open(name = DB_NAME): Promise<IndexedDbStore> {
    return new IndexedDbStore(await openMinnesDb(name));
  }

  async load(): Promise<AppData> {
    return normalize(await this.db.get('state', KEY));
  }

  async save(data: AppData): Promise<void> {
    await this.db.put('state', data, KEY);
  }

  async clear(): Promise<void> {
    await this.db.delete('state', KEY);
  }

  close(): void {
    this.db.close();
  }
}
