// The app's data: one document per device. Nothing leaves the device (docs/06-integritet-och-etik.md).

import type { Attempt, CalibrationRecord, ChildProfile, MemoryItem, Reflection, ReviewState } from '../engine/types';
import type { Deck } from '../content/decks';

export const DATA_VERSION = 1;

export interface AppData {
  version: typeof DATA_VERSION;
  profile: ChildProfile | null;
  /** Guardian has confirmed consent and read how data is handled. */
  guardianConsentAt: string | null;
  /** Four digits that keep children out of the grown-ups' view. Not a security feature. */
  parentPin: string | null;
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
    version: DATA_VERSION,
    profile: null,
    guardianConsentAt: null,
    parentPin: null,
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

/** Fills in fields added after a document was saved. Unknown versions start over. */
export function normalize(stored: unknown): AppData {
  if (!stored || typeof stored !== 'object' || (stored as AppData).version !== DATA_VERSION) return emptyData();
  return { ...emptyData(), ...(stored as AppData) };
}
