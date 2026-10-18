// App-wide state: one AppData document, persisted on every change. Actions wrap the pure engine so
// screens never touch scheduling rules directly.

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { toDay } from '../engine/dates';
import { applyReview, outcomeOf, outcomeOfScore, startReview } from '../engine/scheduler';
import { stepZeroComplete } from '../engine/progression';
import type { Attempt, CalibrationRecord, MemoryItem, Reflection, StepId } from '../engine/types';
import type { Deck } from '../content/decks';
import { clearAll, emptyData, load, newId, save, type AppData } from '../storage/store';

export interface AppActions {
  setupChild(name: string, age: number): void;
  updateChild(changes: { name?: string; age?: number; currentStep?: StepId }): void;
  /** Encode new items: they enter the spaced-retrieval schedule starting tomorrow. */
  learn(items: MemoryItem[]): void;
  /** Log any attempt. Scheduled reviews also move the item along its schedule. */
  recordAttempt(attempt: Omit<Attempt, 'id' | 'at'>): void;
  recordCalibration(record: Omit<CalibrationRecord, 'id' | 'at'>): void;
  recordReflection(reflection: Omit<Reflection, 'id' | 'at'>): void;
  recordStrategyInsight(saysStrategyHelps: boolean): void;
  /** A finished session lights a lantern and counts as a round in the current step. */
  completeSession(step: StepId): void;
  addDeck(deck: Omit<Deck, 'id'>): void;
  removeDeck(deckId: string): void;
  resetAll(): void;
}

interface AppContextValue {
  data: AppData;
  actions: AppActions;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => load());

  const update = useCallback((fn: (d: AppData) => AppData) => {
    setData((prev) => {
      const next = fn(prev);
      save(next);
      return next;
    });
  }, []);

  const actions = useMemo<AppActions>(() => {
    const nowIso = () => new Date().toISOString();
    const today = () => toDay(new Date());

    return {
      setupChild(name, age) {
        update((d) => ({
          ...d,
          guardianConsentAt: nowIso(),
          profile: { name, age, currentStep: 0, createdAt: nowIso() },
        }));
      },
      updateChild(changes) {
        update((d) => (d.profile ? { ...d, profile: { ...d.profile, ...changes } } : d));
      },
      learn(items) {
        update((d) => {
          const known = new Set(d.items.map((i) => i.id));
          const fresh = items.filter((i) => !known.has(i.id));
          return {
            ...d,
            items: [...d.items, ...fresh],
            reviews: [...d.reviews, ...fresh.map((i) => startReview(i, today()))],
          };
        });
      },
      recordAttempt(partial) {
        update((d) => {
          const attempt: Attempt = { ...partial, id: newId(), at: nowIso() };
          let reviews = d.reviews;
          if (attempt.context === 'review') {
            const outcome = attempt.score ? outcomeOfScore(attempt.score) : outcomeOf(attempt);
            reviews = d.reviews.map((r) =>
              r.itemId === attempt.itemId ? applyReview(r, attempt.technique, outcome, today()) : r,
            );
          }
          return { ...d, attempts: [...d.attempts, attempt], reviews };
        });
      },
      recordCalibration(record) {
        update((d) => ({ ...d, calibrations: [...d.calibrations, { ...record, id: newId(), at: nowIso() }] }));
      },
      recordReflection(reflection) {
        update((d) => ({ ...d, reflections: [...d.reflections, { ...reflection, id: newId(), at: nowIso() }] }));
      },
      recordStrategyInsight(saysStrategyHelps) {
        update((d) => ({ ...d, saysStrategyHelps: d.saysStrategyHelps || saysStrategyHelps }));
      },
      completeSession(step) {
        update((d) => {
          const roundsByStep = { ...d.roundsByStep, [step]: (d.roundsByStep[step] ?? 0) + 1 };
          let profile = d.profile;
          if (
            profile &&
            profile.currentStep === 0 &&
            step === 0 &&
            stepZeroComplete({ completedRounds: roundsByStep[0] ?? 0, saysStrategyHelps: d.saysStrategyHelps })
          ) {
            profile = { ...profile, currentStep: 1 };
          }
          return { ...d, roundsByStep, profile, sessionsCompleted: d.sessionsCompleted + 1 };
        });
      },
      addDeck(deck) {
        update((d) => ({ ...d, customDecks: [...d.customDecks, { ...deck, id: `egen-${newId()}` }] }));
      },
      removeDeck(deckId) {
        update((d) => ({ ...d, customDecks: d.customDecks.filter((x) => x.id !== deckId) }));
      },
      resetAll() {
        clearAll();
        setData(emptyData());
      },
    };
  }, [update]);

  const value = useMemo(() => ({ data, actions }), [data, actions]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
