import { describe, expect, it } from 'vitest';
import { addDays, daysBetween, toDay } from './dates';
import {
  applyReview,
  availableHints,
  dueToday,
  INTERVALS,
  MAINTENANCE_GAP_DAYS,
  outcomeOf,
  outcomeOfScore,
  startReview,
} from './scheduler';
import { calibrationBias, delayedRecall, longTermHeadline, meanHintSteps, recallIn } from './metrics';
import { planSession } from './session';
import { STEPS, stepZeroComplete } from './progression';
import type { Attempt, MemoryItem, ReviewState, Technique } from './types';

const card = (id: string, technique: Technique = 'retrieval', extra = {}): MemoryItem => ({
  id,
  deckId: 'd',
  technique,
  content: { kind: 'card', prompt: '6 · 7', answer: '42', ...extra },
  createdAt: '2026-10-01T10:00:00',
});

const attempt = (over: Partial<Attempt>): Attempt => ({
  id: Math.random().toString(36),
  itemId: 'a',
  at: '2026-10-08T10:00:00',
  context: 'review',
  technique: 'retrieval',
  hint: 'none',
  correct: true,
  ...over,
});

describe('dates', () => {
  it('works on local calendar days across month boundaries', () => {
    expect(addDays('2026-10-30', 3)).toBe('2026-11-02');
    expect(daysBetween('2026-10-30', '2026-11-02')).toBe(3);
    expect(toDay(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });
});

describe('scheduler', () => {
  const cumulative = (t: Technique) =>
    INTERVALS[t].reduce<number[]>((acc, gap) => [...acc, (acc.at(-1) ?? 0) + gap], []);

  it('follows the delayed tests from the progression', () => {
    expect(cumulative('retrieval')).toEqual([1, 3, 7, 14, 30]);
    expect(cumulative('keyword')).toEqual([1, 2, 4, 7, 14, 30]);
    expect(cumulative('metamemory')[0]).toBe(1);
  });

  it('gives image-based memories denser early repetition than plain retrieval', () => {
    const early = (t: Technique) => cumulative(t).filter((d) => d <= 7).length;
    expect(early('imagery')).toBeGreaterThan(early('retrieval'));
    expect(early('keyword')).toBeGreaterThan(early('retrieval'));
  });

  it('schedules a new item for tomorrow', () => {
    expect(startReview(card('a'), '2026-10-01').dueOn).toBe('2026-10-02');
  });

  it('advances when remembered, repeats when hinted, restarts when forgotten', () => {
    const s: ReviewState = { itemId: 'a', learnedOn: '2026-10-01', stage: 2, dueOn: '2026-10-08' };
    expect(applyReview(s, 'retrieval', 'remembered', '2026-10-08')).toMatchObject({
      stage: 3,
      dueOn: '2026-10-15',
      lastReviewedOn: '2026-10-08',
    });
    expect(applyReview(s, 'retrieval', 'rememberedWithHint', '2026-10-08').stage).toBe(2);
    expect(applyReview(s, 'retrieval', 'forgotten', '2026-10-08')).toMatchObject({
      stage: 0,
      dueOn: '2026-10-09',
    });
  });

  it('keeps a steady maintenance gap after the last interval', () => {
    const s: ReviewState = { itemId: 'a', learnedOn: '2026-01-01', stage: 9, dueOn: '2026-10-08' };
    expect(applyReview(s, 'retrieval', 'remembered', '2026-10-08').dueOn).toBe(
      addDays('2026-10-08', MAINTENANCE_GAP_DAYS),
    );
  });

  it('classifies a revealed answer as forgotten even if marked correct', () => {
    expect(outcomeOf({ correct: true, hint: 'answer' })).toBe('forgotten');
    expect(outcomeOf({ correct: true, hint: 'firstLetter' })).toBe('rememberedWithHint');
    expect(outcomeOf({ correct: false, hint: 'none' })).toBe('forgotten');
  });

  it('lists due and overdue items, oldest first, skipping ones reviewed today', () => {
    const states: ReviewState[] = [
      { itemId: 'later', learnedOn: '2026-10-01', stage: 0, dueOn: '2026-10-09' },
      { itemId: 'today', learnedOn: '2026-10-01', stage: 0, dueOn: '2026-10-08' },
      { itemId: 'overdue', learnedOn: '2026-10-01', stage: 0, dueOn: '2026-10-03' },
      {
        itemId: 'done',
        learnedOn: '2026-10-01',
        stage: 0,
        dueOn: '2026-10-08',
        lastReviewedOn: '2026-10-08',
      },
    ];
    expect(dueToday(states, '2026-10-08').map((s) => s.itemId)).toEqual(['overdue', 'today']);
  });

  it('offers only the hints the item supports, always ending with the answer', () => {
    expect(availableHints(card('a'))).toEqual(['firstLetter', 'answer']);
    expect(availableHints(card('a', 'loci', { place: 'dörren', pictureId: 'apple' }))).toEqual([
      'firstLetter',
      'place',
      'picture',
      'answer',
    ]);
  });
});

describe('metrics', () => {
  const states: ReviewState[] = [
    { itemId: 'old', learnedOn: '2026-10-01', stage: 1, dueOn: '2026-10-08' },
    { itemId: 'new', learnedOn: '2026-10-06', stage: 0, dueOn: '2026-10-08' },
  ];

  it('counts delayed recall only for items old enough, first attempt per day', () => {
    const attempts = [
      attempt({ itemId: 'old', correct: false, at: '2026-10-08T10:00:00' }),
      attempt({ itemId: 'old', correct: true, at: '2026-10-08T10:05:00' }),
      attempt({ itemId: 'new', correct: true }),
    ];
    expect(delayedRecall(attempts, states, 6)).toEqual({ recalled: 0, total: 1 });
  });

  it('counts picture-set scores as individual pictures', () => {
    const attempts = [attempt({ itemId: 'old', score: { recalled: 4, total: 6 } })];
    expect(longTermHeadline(attempts, states)).toEqual({ recalled: 4, total: 6 });
  });

  it('has no headline before anything is a week old', () => {
    expect(longTermHeadline([attempt({ itemId: 'new' })], states)).toBeNull();
  });

  it('does not count a revealed answer as recalled', () => {
    const r = recallIn([attempt({ context: 'learn', hint: 'answer' }), attempt({ context: 'learn' })], 'learn');
    expect(r).toEqual({ recalled: 1, total: 2 });
  });

  it('computes calibration bias and hint need', () => {
    const rec = (predicted: number, actual: number) => ({
      id: 'x',
      at: '',
      itemId: 'a',
      predicted,
      actual,
      total: 6,
    });
    expect(calibrationBias([rec(6, 3), rec(4, 5)])).toBe(1);
    expect(calibrationBias([])).toBeNull();
    expect(meanHintSteps([attempt({ hint: 'none' }), attempt({ hint: 'firstLetter' })])).toBe(0.5);
  });
});

describe('session plan', () => {
  it('starts with warm-up only when something is due, and ends with reflection and a mission', () => {
    const due: ReviewState[] = [{ itemId: 'a', learnedOn: '2026-10-01', stage: 0, dueOn: '2026-10-02' }];
    expect(planSession(0, due, '2026-10-02').map((p) => p.kind)).toEqual([
      'warmup',
      'tool',
      'reflection',
      'mission',
    ]);
    expect(planSession(1, [], '2026-10-02').map((p) => p.kind)).toEqual(['tool', 'reflection', 'mission']);
  });
});

describe('progression', () => {
  it('has eight steps in order', () => {
    expect(STEPS.map((s) => s.id)).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it('completes step 0 after two rounds and a strategy insight', () => {
    expect(stepZeroComplete({ completedRounds: 2, saysStrategyHelps: true })).toBe(true);
    expect(stepZeroComplete({ completedRounds: 5, saysStrategyHelps: false })).toBe(false);
  });
});

describe('picture set outcome', () => {
  it('counts most of the set as remembered', () => {
    expect(outcomeOfScore({ recalled: 5, total: 6 })).toBe('remembered');
    expect(outcomeOfScore({ recalled: 4, total: 6 })).toBe('forgotten');
  });
});
