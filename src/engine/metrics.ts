// Measurement indicators (docs/05-matning-och-validering.md, E6). Points, speed and streaks are
// deliberately not computed anywhere: they are not learning measures.

import { daysBetween, toDay } from './dates';
import type { Attempt, CalibrationRecord, HintLevel, ReviewState } from './types';
import { HINT_LADDER } from './types';

export interface Ratio {
  recalled: number;
  total: number;
}

function addAttempt(acc: Ratio, attempt: Attempt): Ratio {
  if (attempt.score) {
    return {
      recalled: acc.recalled + attempt.score.recalled,
      total: acc.total + attempt.score.total,
    };
  }
  const remembered = attempt.correct && attempt.hint !== 'answer';
  return { recalled: acc.recalled + (remembered ? 1 : 0), total: acc.total + 1 };
}

/** Omedelbar återkallning / Återkallning inom passet: share remembered in one context. */
export function recallIn(attempts: readonly Attempt[], context: Attempt['context']): Ratio {
  return attempts.filter((a) => a.context === context).reduce(addAttempt, { recalled: 0, total: 0 });
}

/**
 * Fördröjd återkallning: scheduled reviews of items learned at least `minAgeDays` ago.
 * Only the first review attempt per item and day counts, so retries do not inflate the figure.
 */
export function delayedRecall(
  attempts: readonly Attempt[],
  states: readonly ReviewState[],
  minAgeDays: number,
): Ratio {
  const learnedOn = new Map(states.map((s) => [s.itemId, s.learnedOn]));
  const seen = new Set<string>();
  let acc: Ratio = { recalled: 0, total: 0 };
  for (const attempt of [...attempts].sort((a, b) => a.at.localeCompare(b.at))) {
    if (attempt.context !== 'review') continue;
    const learned = learnedOn.get(attempt.itemId);
    const day = toDay(new Date(attempt.at));
    if (!learned || daysBetween(learned, day) < minAgeDays) continue;
    const key = `${attempt.itemId}@${day}`;
    if (seen.has(key)) continue;
    seen.add(key);
    acc = addAttempt(acc, attempt);
  }
  return acc;
}

/**
 * The headline the child sees: "Du kom ihåg 8 av 10 från förra veckan".
 * Built from this session's review attempts on items that are at least six days old.
 * Returns null when there is nothing old enough yet.
 */
export function longTermHeadline(
  sessionAttempts: readonly Attempt[],
  states: readonly ReviewState[],
): Ratio | null {
  const ratio = delayedRecall(sessionAttempts, states, 6);
  return ratio.total > 0 ? ratio : null;
}

/** Kalibrering: mean signed gap between prediction and outcome (positive = overconfident). */
export function calibrationBias(records: readonly CalibrationRecord[]): number | null {
  if (records.length === 0) return null;
  const sum = records.reduce((acc, r) => acc + (r.predicted - r.actual), 0);
  return sum / records.length;
}

/** Ledtrådsbehov: mean number of hint steps used per attempt (0 = no help). */
export function meanHintSteps(attempts: readonly Attempt[]): number | null {
  if (attempts.length === 0) return null;
  const steps = (h: HintLevel) => HINT_LADDER.indexOf(h);
  return attempts.reduce((acc, a) => acc + steps(a.hint), 0) / attempts.length;
}
