// Local, on-device storage. Nothing leaves the device (docs/06-integritet-och-etik.md).
// One versioned JSON document in localStorage; swap for IndexedDB when photos for the memory
// palace arrive (docs/PLAN.md, M3).

import type {
  Attempt,
  CalibrationRecord,
  ChildProfile,
  MemoryItem,
  Reflection,
  ReviewState,
} from '../engine/types';
import type { Deck } from '../content/decks';

export const SCHEMA_VERSION = 1;
const KEY = 'minnesstigen.v1';

export interface AppData {
  version: typeof SCHEMA_VERSION;
  profile: ChildProfile | null;
  /** Guardian has confirmed consent and read how data is handled. */
  guardianConsentAt: string | null;
  items: MemoryItem[];
  reviews: ReviewState[];
  attempts: Attempt[];
  calibrations: CalibrationRecord[];
  reflections: Reflection[];
  /** Completed rounds per step, used by advance criteria. */
  roundsByStep: Record<number, number>;
  /** Steg 0 criterion: the child has said you can do something to remember better. */
  saysStrategyHelps: boolean;
  /** World progress: lanterns lit. Counts participation only, never performance. */
  sessionsCompleted: number;
  /** Lists added by a parent or teacher (Skolkopplingen). */
  customDecks: Deck[];
}

export function emptyData(): AppData {
  return {
    version: SCHEMA_VERSION,
    profile: null,
    guardianConsentAt: null,
    items: [],
    reviews: [],
    attempts: [],
    calibrations: [],
    reflections: [],
    roundsByStep: {},
    saysStrategyHelps: false,
    sessionsCompleted: 0,
    customDecks: [],
  };
}

export function load(storage: Storage = localStorage): AppData {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return emptyData();
    const parsed = JSON.parse(raw) as AppData;
    if (parsed.version !== SCHEMA_VERSION) return emptyData();
    return { ...emptyData(), ...parsed };
  } catch {
    return emptyData();
  }
}

export function save(data: AppData, storage: Storage = localStorage): void {
  try {
    storage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Storage full or blocked (private mode). The session still works in memory.
  }
}

export function clearAll(storage: Storage = localStorage): void {
  try {
    storage.removeItem(KEY);
  } catch {
    // ignore
  }
}

export function newId(): string {
  return crypto.randomUUID();
}
