// Mönsterskogen: the start screen. The path with its lanterns, and the way into today's session.

import { toDay } from '../../engine/dates';
import { dueToday } from '../../engine/scheduler';
import { forestScene, LANTERN_COUNT } from '../../graphics/forest';
import { show, type AppContext } from '../app';
import { h } from '../dom';
import { button, iconButton } from '../ui';
import { showPinGate } from './pinGate';
import { showSession } from './session';

export function showHome(ctx: AppContext): void {
  const data = ctx.state.data;
  const due = dueToday(data.reviews, toDay(new Date())).length;
  const lit = Math.min(data.sessionsCompleted, LANTERN_COUNT);
  const view = h(
    'main',
    { class: 'home' },
    h('div', { class: 'home__scene' }, forestScene(lit)),
    h(
      'div',
      { class: 'home__overlay' },
      h(
        'header',
        { class: 'home__header' },
        h('div', { class: 'home__title' }, h('h1', null, `Hej ${data.profile?.name}!`), h('p', null, `Mönsterskogen · ${lit} av ${LANTERN_COUNT} lyktor tända`)),
        iconButton('grown', 'För vuxna', () => showPinGate(ctx)),
      ),
      h(
        'footer',
        { class: 'home__footer' },
        due > 0 && h('span', { class: 'pill' }, `${due} ${due === 1 ? 'sak väntar' : 'saker väntar'} på att plockas fram`),
        ctx.storageKind === 'memory' && h('span', { class: 'pill' }, 'Den här webbläsaren sparar inget – allt försvinner när sidan stängs.'),
        button(data.sessionsCompleted > 0 ? 'Gå stigen igen' : 'Gå stigen', { variant: 'primary', big: true, wide: true, icon: 'leaf', onClick: () => showSession(ctx) }),
      ),
    ),
  );
  show(ctx, view);
}
