// Göm och säg (steg 1): titta – göm – säg – kolla. The answer hides under a flap; the child says it
// aloud or picks it, can climb the hint ladder, and always sees the correct answer afterwards.

import { shuffle } from '../../app/learning';
import { availableHints } from '../../engine/scheduler';
import type { CardContent, HintLevel, MemoryItem } from '../../engine/types';
import { icon } from '../../graphics/icons';
import { picture } from '../../graphics/pictures';
import { langTag } from '../../content/languages';
import type { AppContext } from '../app';
import { fill, h, type Child } from '../dom';
import { button, guide } from '../ui';

export interface CardResult {
  correct: boolean;
  hint: HintLevel;
}

function hintView(hint: HintLevel, card: CardContent): Child {
  if (hint === 'firstLetter')
    return h('div', { class: 'hint' }, 'Börjar på: ', h('b', { lang: langTag(card.answerLang) }, `${card.answer.charAt(0).toUpperCase()}…`));
  if (hint === 'place') return h('div', { class: 'hint' }, 'Platsen: ', h('b', null, card.place ?? ''));
  if (hint === 'picture' && card.pictureId) return h('div', { class: 'hint' }, picture(card.pictureId, 72));
  return null;
}

function feedbackText(result: CardResult): string {
  if (result.correct && result.hint === 'none') return 'Du plockade fram det själv! Det är så minnet blir starkt.';
  if (result.correct) return 'Rätt med lite hjälp. Snyggt försök – vi tar den igen snart.';
  return 'Nu vet du svaret. Bra att du försökte först – vi tar den igen i morgon.';
}

function flashcard(card: CardContent, open: boolean, withPicture = false): HTMLElement {
  return h(
    'div',
    { class: 'card flashcard' },
    withPicture && card.pictureId && picture(card.pictureId, 96),
    h('div', { class: 'flashcard__prompt', lang: langTag(card.promptLang) }, card.prompt),
    h(
      'div',
      { class: `flashcard__flap ${open ? 'flashcard__flap--open pop' : 'flashcard__flap--hidden'}`, lang: open ? langTag(card.answerLang) : undefined },
      open ? card.answer : h('span', { class: 'flap-label' }, icon('eyeClosed'), ' gömt'),
    ),
  );
}

export function hideAndSay(ctx: AppContext, mount: HTMLElement, item: MemoryItem, onDone: (r: CardResult) => void): void {
  const card = item.content as CardContent;
  const hints = availableHints(item);
  // Picking only makes sense with at least two wrong options; otherwise the child says it aloud.
  const distractors = card.distractors ?? [];
  const choices = distractors.length >= 2 ? shuffle([card.answer, ...distractors.slice(0, 2)]) : [];
  let hintCount = 0;
  const currentHint = (): HintLevel => (hintCount === 0 ? 'none' : hints[hintCount - 1]!);
  const shownHints = () => hints.slice(0, hintCount).filter((x) => x !== 'answer').map((x) => hintView(x, card));

  const ask = () => {
    const nextIsAnswer = hints[hintCount] === 'answer';
    fill(
      mount,
      guide(ctx, 'thinking', 'Vad är svaret? Försök minnas innan du tittar.'),
      flashcard(card, false),
      shownHints(),
      choices.length > 0 &&
        h(
          'div',
          { class: 'choices' },
          choices.map((choice) =>
            button(h('span', { lang: langTag(card.answerLang) }, choice), { big: true, class: 'choice', onClick: () => feedback({ correct: choice === card.answer && currentHint() !== 'answer', hint: currentHint() }, choice) }),
          ),
        ),
      h(
        'div',
        { class: 'row' },
        button('Jag säger högt', { variant: choices.length ? 'ghost' : 'forest', big: !choices.length, icon: 'speak', onClick: selfCheck }),
        button(nextIsAnswer ? 'Visa svaret' : 'Ledtråd', {
          variant: 'ghost',
          icon: 'hint',
          onClick: () => {
            hintCount++;
            if (hints[hintCount - 1] === 'answer') feedback({ correct: false, hint: 'answer' });
            else ask();
          },
        }),
      ),
    );
  };

  const selfCheck = () =>
    fill(
      mount,
      guide(ctx, 'happy', 'Här är svaret. Sa du rätt?'),
      flashcard(card, true),
      shownHints(),
      h(
        'div',
        { class: 'row' },
        button('Ja, rätt!', { variant: 'forest', big: true, onClick: () => feedback({ correct: true, hint: currentHint() }) }),
        button('Inte riktigt', { big: true, onClick: () => feedback({ correct: false, hint: currentHint() }) }),
      ),
    );

  const feedback = (result: CardResult, picked?: string) =>
    fill(
      mount,
      guide(ctx, result.correct ? 'cheer' : 'happy', feedbackText(result)),
      flashcard(card, true),
      shownHints(),
      picked !== undefined &&
        picked !== card.answer &&
        h(
          'p',
          { class: 'muted center' },
          'Du valde ',
          h('b', { lang: langTag(card.answerLang) }, picked),
          '. Rätt svar är ',
          h('b', { lang: langTag(card.answerLang) }, card.answer),
          '.',
        ),
      button('Vidare', { variant: 'primary', big: true, wide: true, icon: 'next', onClick: () => onDone(result) }),
    );

  ask();
}

/** Titta: study a new card with the answer visible before it is hidden. */
export function studyCard(ctx: AppContext, mount: HTMLElement, item: MemoryItem, onNext: () => void): void {
  const card = item.content as CardContent;
  fill(
    mount,
    guide(
      ctx,
      'happy',
      ['Titta och säg tyst för dig själv:', { text: card.prompt, lang: card.promptLang ?? 'sv' }, { text: card.answer, lang: card.answerLang ?? 'sv' }],
      'Titta noga och säg det tyst för dig själv.',
    ),
    flashcard(card, true, true),
    button('Nästa', { variant: 'primary', big: true, wide: true, icon: 'next', onClick: onNext }),
  );
}
