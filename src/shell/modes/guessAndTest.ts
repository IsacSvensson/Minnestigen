// Gissa och pröva (steg 0): look at six pictures, predict how many you will remember, get tested,
// compare prediction with outcome. Builds metamemory; the set comes back tomorrow.

import { randomPictures } from '../../app/learning';
import { calibrationJars } from '../../graphics/jars';
import { owl } from '../../graphics/owl';
import { picture } from '../../graphics/pictures';
import type { AppContext } from '../app';
import { fill, h } from '../dom';
import { button, guide } from '../ui';
import { pictureRecall, type RecallResult } from './pictureRecall';

export const SET_SIZE = 6;

export interface GuessAndTestResult {
  pictureIds: string[];
  predicted: number;
  recall: RecallResult;
  saysStrategyHelps: boolean;
}

export function guessAndTest(ctx: AppContext, mount: HTMLElement, onDone: (r: GuessAndTestResult) => void): void {
  const pictureIds = randomPictures(SET_SIZE);
  let predicted: number | null = null;

  const look = () =>
    fill(
      mount,
      guide(ctx, 'happy', 'Titta på bilderna så länge du vill. Tryck sen på Klar.', ['Titta på bilderna så länge du vill. Tryck sen på ', h('b', null, 'Klar'), '.']),
      h('div', { class: 'picture-grid' }, pictureIds.map((id) => h('div', { class: 'tile' }, picture(id)))),
      button('Klar', { variant: 'primary', big: true, wide: true, icon: 'check', onClick: guess }),
    );

  const guess = () =>
    fill(
      mount,
      guide(ctx, 'thinking', 'Hur många av de sex bilderna tror du att du kommer ihåg?'),
      h(
        'div',
        { class: 'numbers', role: 'group', 'aria-label': 'Din gissning' },
        Array.from({ length: SET_SIZE + 1 }, (_, n) =>
          button(String(n), {
            big: true,
            variant: predicted === n ? 'primary' : 'plain',
            pressed: predicted === n,
            onClick: () => {
              predicted = n;
              guess();
            },
          }),
        ),
      ),
      button('Det är min gissning', { variant: 'forest', big: true, wide: true, disabled: predicted === null, onClick: pause }),
    );

  // A short break so the test is not just reading off what is still in view.
  const pause = () =>
    fill(
      mount,
      h(
        'div',
        { class: 'screen__body screen__body--center' },
        owl('sleepy', 180),
        h('h2', null, 'Blunda och räkna till fem'),
        h('p', { class: 'muted' }, 'Bilderna är gömda nu.'),
        button('Nu kör vi!', { variant: 'primary', big: true, onClick: test }),
      ),
    );

  const test = () => pictureRecall(ctx, mount, pictureIds, 'Vilka bilder såg du? Tryck på dem du kommer ihåg.', compare);

  const compare = (recall: RecallResult) => {
    const p = predicted ?? 0;
    const done = (saysStrategyHelps: boolean) => onDone({ pictureIds, predicted: p, recall, saysStrategyHelps });
    fill(
      mount,
      guide(
        ctx,
        'happy',
        `Du gissade ${p} och kom ihåg ${recall.recalled}. Tror du att man kan göra något för att komma ihåg fler?`,
        ['Du gissade ', h('b', null, p), ' och kom ihåg ', h('b', null, recall.recalled), '. Tror du att man kan göra något för att komma ihåg fler?'],
      ),
      calibrationJars(p, recall.recalled, SET_SIZE),
      h(
        'div',
        { class: 'row' },
        button('Ja!', { variant: 'forest', big: true, onClick: () => done(true) }),
        button('Vet inte', { big: true, onClick: () => done(false) }),
      ),
    );
  };

  look();
}
