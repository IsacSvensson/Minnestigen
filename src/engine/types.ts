// Domain model for the pedagogical engine. Pure data, no UI or storage concerns.
// Swedish domain terms are kept in comments so the code maps to docs/03-metod-minnesstigen.md.

/** Progression step 0–7 (docs/03-metod-minnesstigen.md, D2). */
export type StepId = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Which memory technique an item was encoded with. Drives the review schedule:
 * image-based memories are forgotten faster and get denser repetition (Wang & Thomas).
 */
export type Technique =
  | 'retrieval' // Plocka fram: titta–göm–säg–kolla
  | 'metamemory' // Gissa och pröva
  | 'grouping' // Sortera och gruppera
  | 'imagery' // Bilder och berättelser
  | 'loci' // Minnespalats
  | 'keyword'; // Nyckelord och knaggar

/** Support fades per technique: visa → gör tillsammans → gör själv. */
export type SupportLevel = 'show' | 'together' | 'self';

/**
 * Ledtrådsstege. 0 = no hint. Higher = more help. 'answer' means the answer was revealed
 * before the child produced it, which counts as not remembered.
 */
export const HINT_LADDER = ['none', 'firstLetter', 'place', 'picture', 'answer'] as const;
export type HintLevel = (typeof HINT_LADDER)[number];

/** A question/answer card, e.g. a times-table fact or a word pair from Skolkopplingen. */
export interface CardContent {
  kind: 'card';
  prompt: string;
  answer: string;
  /** Optional picture id from the custom picture catalog, used as a hint step. */
  pictureId?: string;
  /** Optional place cue (e.g. loci location), used as a hint step. */
  place?: string;
  /** Wrong but plausible options for the "välj" answer mode. */
  distractors?: string[];
}

/** A set of pictures to remember, used by Gissa och pröva and its next-day check. */
export interface PictureSetContent {
  kind: 'pictureSet';
  pictureIds: string[];
}

export type ItemContent = CardContent | PictureSetContent;

/** Something the child has learned and that the engine will bring back for retrieval. */
export interface MemoryItem {
  id: string;
  /** Which deck/list the item came from (sample deck or a parent-added list). */
  deckId: string;
  technique: Technique;
  content: ItemContent;
  createdAt: string; // ISO timestamp
}

/** Spaced-retrieval state for one item. */
export interface ReviewState {
  itemId: string;
  /** Local calendar date (YYYY-MM-DD) when the item was first encoded. */
  learnedOn: string;
  /** Index into the technique's interval sequence. */
  stage: number;
  /** Local calendar date when the item is next due. */
  dueOn: string;
  lastReviewedOn?: string;
}

/** Where in the app an attempt happened. Matters for measurement (docs/05). */
export type AttemptContext =
  | 'learn' // during Dagens verktyg
  | 'return' // Återvänd, 1–3 minutes later in the same session
  | 'review' // scheduled spaced retrieval (Uppvärmning)
  | 'transfer'; // transfer task outside the game frame

/** One retrieval attempt. The correct answer is always shown afterwards. */
export interface Attempt {
  id: string;
  itemId: string;
  at: string; // ISO timestamp
  context: AttemptContext;
  technique: Technique;
  hint: HintLevel;
  correct: boolean;
  /** For picture sets: how many of the pictures were recalled, and out of how many. */
  score?: { recalled: number; total: number };
}

/** Prediction vs outcome from Gissa och pröva. Basis for the calibration indicator. */
export interface CalibrationRecord {
  id: string;
  at: string;
  itemId: string;
  predicted: number;
  actual: number;
  total: number;
}

/** Answers to "Vilket knep använde du? Hjälpte det?" */
export type StrategyChoice = 'nothing' | 'repeat' | 'picture' | 'group' | 'story' | 'place' | 'dontKnow';

export interface Reflection {
  id: string;
  at: string;
  sessionId: string;
  strategy: StrategyChoice;
  helped: 'yes' | 'some' | 'no' | 'dontKnow';
}

export interface ChildProfile {
  name: string;
  age: number;
  currentStep: StepId;
  createdAt: string;
}
