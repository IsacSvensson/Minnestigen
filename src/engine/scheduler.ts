// Spaced retrieval (Utspridd repetition, N1). See docs/03-metod-minnesstigen.md and docs/04-appkoncept.md (E3).
//
// Research basis: spaced retrieval beats massed (g = 0.74); expanding intervals are no better than
// even ones, so sequences are even or mildly expanding. Image-based memories get denser repetition.
// The exact sequences and the rules for wrong/hinted answers are product proposals (N4) to be
// calibrated in the pilot.

import { addDays, daysBetween } from './dates';
import type { Attempt, HintLevel, MemoryItem, ReviewState, Technique } from './types';

/**
 * Gaps in days between consecutive reviews, per technique. Cumulative offsets from the day of
 * learning are noted for each, matching the delayed tests in the progression (day 1, 3, 7 … 30).
 */
export const INTERVALS: Record<Technique, readonly number[]> = {
  // day 1, 3, 7, 14, 30
  retrieval: [1, 2, 4, 7, 16],
  // next day, then a week and a month (steg 0: "samma bilder nästa dag")
  metamemory: [1, 6, 23],
  // day 1, 7, 14, 30 (steg 2: "efter en dag och en vecka")
  grouping: [1, 6, 7, 16],
  // day 1, 2, 3, 7, 14, 30 – one extra early repetition for image memories
  imagery: [1, 1, 1, 4, 7, 16],
  // day 1, 7, 14, 30 (steg 4)
  loci: [1, 6, 7, 16],
  // day 1, 2, 4, 7, 14, 30 – densest schedule (steg 5)
  keyword: [1, 1, 2, 3, 7, 16],
};

/** After the last interval the item keeps coming back at this steady gap. */
export const MAINTENANCE_GAP_DAYS = 30;

export function gapFor(technique: Technique, stage: number): number {
  return INTERVALS[technique][stage] ?? MAINTENANCE_GAP_DAYS;
}

/** Review state for an item encoded today. */
export function startReview(item: MemoryItem, today: string): ReviewState {
  return {
    itemId: item.id,
    learnedOn: today,
    stage: 0,
    dueOn: addDays(today, gapFor(item.technique, 0)),
  };
}

export type ReviewOutcome = 'remembered' | 'rememberedWithHint' | 'forgotten';

export function outcomeOf(attempt: Pick<Attempt, 'correct' | 'hint'>): ReviewOutcome {
  if (!attempt.correct || attempt.hint === 'answer') return 'forgotten';
  return attempt.hint === 'none' ? 'remembered' : 'rememberedWithHint';
}

/**
 * Picture sets are checked as a whole: remembering most of the set (N4: 80 %) counts as
 * remembered, otherwise the set comes back tomorrow.
 */
export function outcomeOfScore(score: { recalled: number; total: number }): ReviewOutcome {
  return score.recalled >= score.total * 0.8 ? 'remembered' : 'forgotten';
}

/**
 * Move an item along its schedule after a scheduled review.
 * - remembered without help → next, longer gap
 * - remembered with a hint → same gap again
 * - forgotten → back to the first gap (the correct answer has already been shown)
 */
export function applyReview(
  state: ReviewState,
  technique: Technique,
  outcome: ReviewOutcome,
  today: string,
): ReviewState {
  const stage =
    outcome === 'remembered' ? state.stage + 1 : outcome === 'rememberedWithHint' ? state.stage : 0;
  return { ...state, stage, dueOn: addDays(today, gapFor(technique, stage)), lastReviewedOn: today };
}

/**
 * Items due today or overdue, most overdue first. Items already reviewed today are skipped so a
 * second session the same day does not repeat them.
 */
export function dueToday(states: readonly ReviewState[], today: string): ReviewState[] {
  return states
    .filter((s) => daysBetween(s.dueOn, today) >= 0 && s.lastReviewedOn !== today)
    .sort((a, b) => a.dueOn.localeCompare(b.dueOn));
}

/** Hints that make sense for a given item, in ladder order, always ending with the answer. */
export function availableHints(item: MemoryItem): HintLevel[] {
  if (item.content.kind !== 'card') return ['answer'];
  const hints: HintLevel[] = ['firstLetter'];
  if (item.content.place) hints.push('place');
  if (item.content.pictureId) hints.push('picture');
  hints.push('answer');
  return hints;
}
