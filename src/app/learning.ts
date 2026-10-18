// Turns decks into memory items and picks what Dagens verktyg introduces next.

import type { MemoryItem, Technique } from '../engine/types';
import { BUILT_IN_DECKS, type Deck } from '../content/decks';
import { PICTURE_IDS } from '../graphics/pictures';

/** Item ids are stable per deck position, so a card is only ever learned once. */
export function cardItemId(deckId: string, index: number): string {
  return `${deckId}#${index}`;
}

export function deckToItems(deck: Deck, technique: Technique, createdAt: string): MemoryItem[] {
  return deck.cards.map((card, index) => ({
    id: cardItemId(deck.id, index),
    deckId: deck.id,
    technique,
    createdAt,
    content: {
      kind: 'card',
      prompt: card.prompt,
      answer: card.answer,
      pictureId: card.pictureId,
      distractors: card.distractors.length > 0 ? card.distractors : otherAnswers(deck, index),
    },
  }));
}

/**
 * Parent-added cards have no hand-picked distractors; use other answers from the same list,
 * preferring ones that start with a different letter so the first-letter hint stays useful.
 */
function otherAnswers(deck: Deck, index: number): string[] {
  const answer = deck.cards[index]!.answer;
  const first = (s: string) => s.charAt(0).toLowerCase();
  const others = shuffle(deck.cards.map((c) => c.answer).filter((a) => a !== answer));
  const differentLetter = others.filter((a) => first(a) !== first(answer));
  const sameLetter = others.filter((a) => first(a) === first(answer));
  return [...differentLetter, ...sameLetter].slice(0, 2);
}

/** School content first (Skolkopplingen), then built-in decks. */
export function nextNewItems(
  customDecks: readonly Deck[],
  learnedIds: ReadonlySet<string>,
  count: number,
  createdAt: string,
): MemoryItem[] {
  const all = [...customDecks, ...BUILT_IN_DECKS].flatMap((deck) => deckToItems(deck, 'retrieval', createdAt));
  return all.filter((item) => !learnedIds.has(item.id)).slice(0, count);
}

export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

export function randomPictures(count: number, exclude: readonly string[] = []): string[] {
  return shuffle(PICTURE_IDS.filter((id) => !exclude.includes(id))).slice(0, count);
}

/** Parse "fråga = svar" lines from the Skolkopplingen form. Lines without "=" are skipped. */
export function parseCardLines(text: string): Deck['cards'] {
  return text
    .split('\n')
    .map((line) => line.split('='))
    .filter((parts) => parts.length >= 2)
    .map(([prompt, ...rest]) => ({ prompt: prompt!.trim(), answer: rest.join('=').trim(), distractors: [] }))
    .filter((c) => c.prompt && c.answer);
}
