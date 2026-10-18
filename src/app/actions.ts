// Everything that changes the app document, as pure functions: (data, …) → new data. They wrap the
// engine so screens never touch scheduling rules directly, and they run in tests without a browser.

import { toDay } from '../engine/dates';
import { applyReview, outcomeOf, outcomeOfScore, startReview } from '../engine/scheduler';
import { stepZeroComplete } from '../engine/progression';
import type { Attempt, CalibrationRecord, MemoryItem, Reflection, StepId } from '../engine/types';
import type { Deck } from '../content/decks';
import { emptyData, type AppData } from '../storage/data';

export type Action = (data: AppData) => AppData;

const newId = () => crypto.randomUUID();

export const setupChild =
  (name: string, age: number, now: Date): Action =>
  (d) => ({
    ...d,
    guardianConsentAt: now.toISOString(),
    profile: { name, age, currentStep: 0, createdAt: now.toISOString() },
  });

export const updateChild =
  (changes: { name?: string; age?: number; currentStep?: StepId }): Action =>
  (d) => (d.profile ? { ...d, profile: { ...d.profile, ...changes } } : d);

export const setParentPin =
  (pin: string): Action =>
  (d) => ({ ...d, parentPin: pin });

/** Encode new items: they enter the spaced-retrieval schedule starting tomorrow. */
export const learn =
  (items: readonly MemoryItem[], now: Date): Action =>
  (d) => {
    const known = new Set(d.items.map((i) => i.id));
    const fresh = items.filter((i) => !known.has(i.id));
    return {
      ...d,
      items: [...d.items, ...fresh],
      reviews: [...d.reviews, ...fresh.map((i) => startReview(i, toDay(now)))],
    };
  };

/** Log any attempt. Scheduled reviews also move the item along its schedule. */
export const recordAttempt =
  (partial: Omit<Attempt, 'id' | 'at'>, now: Date): Action =>
  (d) => {
    const attempt: Attempt = { ...partial, id: newId(), at: now.toISOString() };
    let reviews = d.reviews;
    if (attempt.context === 'review') {
      const outcome = attempt.score ? outcomeOfScore(attempt.score) : outcomeOf(attempt);
      reviews = d.reviews.map((r) =>
        r.itemId === attempt.itemId ? applyReview(r, attempt.technique, outcome, toDay(now)) : r,
      );
    }
    return { ...d, attempts: [...d.attempts, attempt], reviews };
  };

export const recordCalibration =
  (record: Omit<CalibrationRecord, 'id' | 'at'>, now: Date): Action =>
  (d) => ({ ...d, calibrations: [...d.calibrations, { ...record, id: newId(), at: now.toISOString() }] });

export const recordReflection =
  (reflection: Omit<Reflection, 'id' | 'at'>, now: Date): Action =>
  (d) => ({ ...d, reflections: [...d.reflections, { ...reflection, id: newId(), at: now.toISOString() }] });

export const recordStrategyInsight =
  (saysStrategyHelps: boolean): Action =>
  (d) => ({ ...d, saysStrategyHelps: d.saysStrategyHelps || saysStrategyHelps });

/** A finished session lights a lantern and counts as a round in its step; step 0 may move on. */
export const completeSession =
  (step: StepId): Action =>
  (d) => {
    const roundsByStep = { ...d.roundsByStep, [step]: (d.roundsByStep[step] ?? 0) + 1 };
    let profile = d.profile;
    if (
      profile?.currentStep === 0 &&
      step === 0 &&
      stepZeroComplete({ completedRounds: roundsByStep[0] ?? 0, saysStrategyHelps: d.saysStrategyHelps })
    ) {
      profile = { ...profile, currentStep: 1 };
    }
    return { ...d, roundsByStep, profile, sessionsCompleted: d.sessionsCompleted + 1 };
  };

export const addDeck =
  (deck: Omit<Deck, 'id'>): Action =>
  (d) => ({ ...d, customDecks: [...d.customDecks, { ...deck, id: `egen-${newId()}` }] });

export const removeDeck =
  (deckId: string): Action =>
  (d) => ({ ...d, customDecks: d.customDecks.filter((x) => x.id !== deckId) });

export const resetAll = (): Action => () => emptyData();
