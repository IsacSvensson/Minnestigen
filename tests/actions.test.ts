import { describe, expect, it } from 'vitest';
import * as act from '../src/app/actions';
import type { MemoryItem } from '../src/engine/types';
import { emptyData } from '../src/storage/data';

const day = (d: string) => new Date(`${d}T10:00:00`);
const card: MemoryItem = {
  id: 'c1',
  deckId: 'd',
  technique: 'retrieval',
  content: { kind: 'card', prompt: '6 · 7', answer: '42' },
  createdAt: '',
};

const started = () => act.setupChild('Alva', 7, day('2026-10-01'))(emptyData());

describe('actions', () => {
  it('sets up the child at step 0 with consent', () => {
    const d = started();
    expect(d.profile).toMatchObject({ name: 'Alva', age: 7, currentStep: 0 });
    expect(d.guardianConsentAt).not.toBeNull();
  });

  it('schedules learned items for tomorrow, once', () => {
    let d = act.learn([card], day('2026-10-01'))(started());
    d = act.learn([card], day('2026-10-02'))(d);
    expect(d.items).toHaveLength(1);
    expect(d.reviews).toEqual([{ itemId: 'c1', learnedOn: '2026-10-01', stage: 0, dueOn: '2026-10-02' }]);
  });

  it('moves an item along its schedule on review, not on learn attempts', () => {
    let d = act.learn([card], day('2026-10-01'))(started());
    d = act.recordAttempt({ itemId: 'c1', context: 'learn', technique: 'retrieval', hint: 'none', correct: true }, day('2026-10-01'))(d);
    expect(d.reviews[0]!.stage).toBe(0);
    d = act.recordAttempt({ itemId: 'c1', context: 'review', technique: 'retrieval', hint: 'none', correct: true }, day('2026-10-02'))(d);
    expect(d.reviews[0]).toMatchObject({ stage: 1, dueOn: '2026-10-04', lastReviewedOn: '2026-10-02' });
    expect(d.attempts).toHaveLength(2);
  });

  it('moves on from step 0 after two rounds and the insight, and lights a lantern per session', () => {
    let d = started();
    d = act.recordStrategyInsight(true)(d);
    d = act.completeSession(0)(d);
    expect(d.profile!.currentStep).toBe(0);
    d = act.recordStrategyInsight(false)(d);
    d = act.completeSession(0)(d);
    expect(d.profile!.currentStep).toBe(1);
    expect(d.sessionsCompleted).toBe(2);
  });

  it('adds and removes school lists', () => {
    let d = act.addDeck({ title: 'Glosor', cards: [{ prompt: 'hund', answer: 'dog', distractors: [] }] })(started());
    expect(d.customDecks[0]!.id).toMatch(/^egen-/);
    d = act.removeDeck(d.customDecks[0]!.id)(d);
    expect(d.customDecks).toEqual([]);
  });

  it('forgets everything on reset', () => {
    expect(act.resetAll()(started())).toEqual(emptyData());
  });
});
