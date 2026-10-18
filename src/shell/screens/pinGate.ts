import * as act from '../../app/actions';
import { icon } from '../../graphics/icons';
import { show, type AppContext } from '../app';
import { h } from '../dom';
import { screen } from '../ui';
import { showHome } from './home';
import { showParent } from './parent';

const PIN_LENGTH = 4;

/**
 * A simple PIN in front of the grown-ups' view, as in Mattedalen. It is not a security feature
 * (the data is on the device anyway), it just keeps children from wandering in by accident.
 */
export function showPinGate(ctx: AppContext): void {
  const pin = ctx.state.data.parentPin;
  if (!pin) return choosePin(ctx);
  pinScreen(ctx, 'Vuxenkod', 'Skriv in koden för att komma till vuxenläget.', (entered, retry) => {
    if (entered === pin) showParent(ctx);
    else retry('Fel kod. Försök igen.');
  });
}

function choosePin(ctx: AppContext): void {
  pinScreen(ctx, 'Välj en vuxenkod', 'Fyra siffror som barnen inte känner till.', (first) => {
    pinScreen(ctx, 'Skriv koden igen', 'För att vara säker på att den blev rätt.', (second, retry) => {
      if (second !== first) return retry('Koderna var olika. Börja om.', () => choosePin(ctx));
      ctx.state.apply(act.setParentPin(first));
      showParent(ctx);
    });
  });
}

type Retry = (message: string, then?: () => void) => void;

function pinScreen(ctx: AppContext, title: string, text: string, onPin: (pin: string, retry: Retry) => void): void {
  let value = '';
  const dotsEl = h('div', { class: 'pin-dots', 'aria-live': 'polite' });
  const message = h('p', { class: 'pin-message', role: 'alert' });
  const renderDots = () => {
    dotsEl.replaceChildren(...Array.from({ length: PIN_LENGTH }, (_, i) => h('span', { class: `pin-dot${i < value.length ? ' filled' : ''}` })));
    dotsEl.setAttribute('aria-label', `${value.length} av ${PIN_LENGTH} siffror`);
  };
  const retry: Retry = (msg, then) => {
    value = '';
    renderDots();
    message.textContent = msg;
    if (then) setTimeout(then, 1200);
  };
  const type = (d: string) => {
    if (value.length >= PIN_LENGTH) return;
    value += d;
    message.textContent = '';
    renderDots();
    if (value.length === PIN_LENGTH) onPin(value, retry);
  };
  const erase = () => {
    value = value.slice(0, -1);
    renderDots();
  };
  const key = (d: string) => h('button', { class: 'btn pin-key', type: 'button', onclick: () => type(d) }, d);
  const onKey = (e: KeyboardEvent) => {
    if (/^\d$/.test(e.key)) type(e.key);
    else if (e.key === 'Backspace') erase();
  };

  const { view, body } = screen({ title: 'För vuxna', back: () => showHome(ctx) });
  body.classList.add('screen__body--center');
  body.append(
    h('h1', null, title),
    h('p', { class: 'muted' }, text),
    dotsEl,
    message,
    h(
      'div',
      { class: 'pin-keys' },
      [...'123456789'].map(key),
      h('span'),
      key('0'),
      h('button', { class: 'btn pin-key', type: 'button', 'aria-label': 'Sudda', onclick: erase }, icon('erase')),
    ),
  );
  renderDots();
  document.addEventListener('keydown', onKey);
  show(ctx, view, () => document.removeEventListener('keydown', onKey));
}
