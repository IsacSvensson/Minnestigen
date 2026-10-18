// Built-in practice decks for Göm och säg. Parents and teachers add real school content through
// Skolkopplingen; these exist so the app is usable from the first session.

import type { LanguageCode } from '../engine/types';

export interface DeckCard {
  prompt: string;
  answer: string;
  /**
   * Wrong but plausible options for the "välj" answer mode. Avoid the answer's first letter, so the
   * first-letter hint still helps.
   */
  distractors: string[];
  pictureId?: string;
}

export interface Deck {
  id: string;
  title: string;
  cards: DeckCard[];
  /** Language of the prompts and of the answers, for read-aloud. Absent means Swedish. */
  promptLang?: LanguageCode;
  answerLang?: LanguageCode;
}

export const BUILT_IN_DECKS: readonly Deck[] = [
  {
    id: 'engelska-saker',
    title: 'Engelska: saker',
    answerLang: 'en',
    cards: [
      { prompt: 'äpple', answer: 'apple', distractors: ['egg', 'ball'], pictureId: 'apple' },
      { prompt: 'fisk', answer: 'fish', distractors: ['dish', 'wish'], pictureId: 'fish' },
      { prompt: 'nyckel', answer: 'key', distractors: ['tea', 'bee'], pictureId: 'key' },
      { prompt: 'båt', answer: 'boat', distractors: ['coat', 'goat'], pictureId: 'boat' },
      { prompt: 'hatt', answer: 'hat', distractors: ['cat', 'bat'], pictureId: 'hat' },
      { prompt: 'sol', answer: 'sun', distractors: ['bun', 'run'], pictureId: 'sun' },
      { prompt: 'bok', answer: 'book', distractors: ['cook', 'look'], pictureId: 'book' },
      { prompt: 'sko', answer: 'shoe', distractors: ['blue', 'two'], pictureId: 'shoe' },
    ],
  },
  {
    id: 'tabell-6',
    title: '6:ans tabell',
    cards: [
      { prompt: '6 · 3', answer: '18', distractors: ['16', '24'] },
      { prompt: '6 · 4', answer: '24', distractors: ['28', '18'] },
      { prompt: '6 · 6', answer: '36', distractors: ['32', '42'] },
      { prompt: '6 · 7', answer: '42', distractors: ['48', '36'] },
      { prompt: '6 · 8', answer: '48', distractors: ['42', '56'] },
      { prompt: '6 · 9', answer: '54', distractors: ['56', '45'] },
    ],
  },
];

/** How many new cards Dagens verktyg introduces in one session (fem av veckans ord). */
export const NEW_CARDS_PER_SESSION = 5;
