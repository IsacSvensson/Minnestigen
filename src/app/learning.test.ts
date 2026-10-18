import { describe, expect, it } from 'vitest';
import { cardItemId, deckToItems, nextNewItems, parseCardLines } from './learning';
import { BUILT_IN_DECKS } from '../content/decks';

describe('parseCardLines', () => {
  it('reads "fråga = svar" lines and skips the rest', () => {
    expect(parseCardLines('hund = dog\n\nbara text\n 7 · 8 =56 \nx = \n2+2 = 4 = fyra')).toEqual([
      { prompt: 'hund', answer: 'dog', distractors: [] },
      { prompt: '7 · 8', answer: '56', distractors: [] },
      { prompt: '2+2', answer: '4 = fyra', distractors: [] },
    ]);
  });
});

describe('decks', () => {
  it('gives parent cards distractors from the same list, avoiding the answer', () => {
    const deck = { id: 'egen', title: 'Glosor', cards: parseCardLines('hund = dog\nkatt = cat\nko = cow\nhäst = horse') };
    for (const item of deckToItems(deck, 'retrieval', '')) {
      if (item.content.kind !== 'card') throw new Error('expected card');
      expect(item.content.distractors).toHaveLength(2);
      expect(item.content.distractors).not.toContain(item.content.answer);
    }
  });

  it('built-in distractors never share the first letter with the answer', () => {
    for (const deck of BUILT_IN_DECKS.filter((d) => d.id === 'engelska-saker')) {
      for (const card of deck.cards) {
        for (const d of card.distractors) expect(d.charAt(0)).not.toBe(card.answer.charAt(0));
      }
    }
  });

  it('introduces school lists first and never repeats learned cards', () => {
    const school = { id: 'egen', title: 'Glosor', cards: parseCardLines('hund = dog\nkatt = cat') };
    const first = nextNewItems([school], new Set(), 3, '');
    expect(first.map((i) => i.id)).toEqual([cardItemId('egen', 0), cardItemId('egen', 1), cardItemId('engelska-saker', 0)]);
    const learned = new Set(first.map((i) => i.id));
    expect(nextNewItems([school], learned, 1, '')[0]!.id).toBe(cardItemId('engelska-saker', 1));
  });
});
