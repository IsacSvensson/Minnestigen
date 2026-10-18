// First run, filled in by a guardian: consent and the child's name and age (docs/06).

import * as act from '../../app/actions';
import { owl } from '../../graphics/owl';
import { show, type AppContext } from '../app';
import { h } from '../dom';
import { button, screen } from '../ui';
import { showHome } from './home';

export function showSetup(ctx: AppContext): void {
  const { view, body } = screen();
  const name = h('input', { id: 'child-name', autocomplete: 'off', maxlength: '24' });
  const age = h('select', { id: 'child-age' }, [6, 7, 8, 9, 10, 11, 12].map((a) => h('option', { value: String(a), selected: a === 7 }, `${a} år`)));
  const consent = h('input', { type: 'checkbox', id: 'consent' });
  const start = button('Börja', {
    variant: 'primary',
    big: true,
    wide: true,
    disabled: true,
    onClick: () => {
      ctx.state.apply(act.setupChild(name.value.trim(), Number(age.value), new Date()));
      showHome(ctx);
    },
  });
  const validate = () => {
    start.disabled = !(name.value.trim().length > 0 && consent.checked);
  };
  name.addEventListener('input', validate);
  consent.addEventListener('change', validate);

  body.append(
    h('div', { class: 'brand' }, owl('happy', 96), h('div', null, h('h1', null, 'Minnesstigen'), h('p', { class: 'muted' }, 'För vuxna: fyll i tillsammans med barnet.'))),
    h(
      'div',
      { class: 'card stack' },
      h('label', { class: 'field', for: 'child-name' }, 'Barnets namn eller smeknamn', name),
      h('label', { class: 'field', for: 'child-age' }, 'Ålder', age),
    ),
    h(
      'div',
      { class: 'card card--soft stack small' },
      h('h3', null, 'Så hanteras data'),
      h(
        'p',
        null,
        'Allt barnet gör sparas bara på den här enheten. Inget skickas till någon server, det finns ingen reklam, inga köp och inga sociala funktioner. Du kan radera allt i vuxenläget.',
      ),
      h('label', { class: 'check' }, consent, h('span', null, 'Jag är vårdnadshavare och godkänner att barnet använder appen.')),
    ),
    start,
  );
  show(ctx, view);
}
