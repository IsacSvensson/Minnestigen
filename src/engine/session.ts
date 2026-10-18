// What one 5–10 minute session contains (docs/04-appkoncept.md, E1). The engine decides the plan;
// the UI only renders it.

import { dueToday } from './scheduler';
import { stepById, type GameMode } from './progression';
import type { ReviewState, StepId } from './types';

export type SessionPhase =
  | { kind: 'warmup'; itemIds: string[] } // Uppvärmning – plocka fram det som är på tur
  | { kind: 'tool'; step: StepId; mode: GameMode } // Dagens verktyg
  | { kind: 'reflection' } // Vilket knep använde du? Hjälpte det?
  | { kind: 'mission'; text: string }; // Vardagsuppdrag

/** Keep the warm-up short so the session stays within 5–10 minutes. */
export const MAX_WARMUP_ITEMS = 8;

export function planSession(step: StepId, reviews: readonly ReviewState[], today: string): SessionPhase[] {
  const definition = stepById(step);
  const due = dueToday(reviews, today).slice(0, MAX_WARMUP_ITEMS);
  const phases: SessionPhase[] = [];
  if (due.length > 0) phases.push({ kind: 'warmup', itemIds: due.map((s) => s.itemId) });
  phases.push({ kind: 'tool', step, mode: definition.modes[0]! });
  phases.push({ kind: 'reflection' });
  phases.push({ kind: 'mission', text: definition.everydayMission });
  return phases;
}
