// Shared building blocks: buttons, the screen frame, the owl with its speech bubble, progress dots.

import { icon, type IconName } from '../graphics/icons';
import { owl, type OwlMood } from '../graphics/owl';
import type { AppContext } from './app';
import { h, type Child, type Props } from './dom';
import { speak, type Spoken } from './speech';

type Variant = 'primary' | 'forest' | 'ghost' | 'plain';

interface ButtonOptions {
  variant?: Variant;
  big?: boolean;
  wide?: boolean;
  icon?: IconName;
  disabled?: boolean;
  class?: string;
  label?: string;
  pressed?: boolean;
  onClick: () => void;
}

export function button(text: Child, o: ButtonOptions): HTMLButtonElement {
  const classes = ['btn', o.variant && o.variant !== 'plain' && `btn--${o.variant}`, o.big && 'btn--big', o.wide && 'btn--wide', o.class]
    .filter(Boolean)
    .join(' ');
  const props: Props = { type: 'button', class: classes, disabled: o.disabled, onclick: o.onClick };
  if (o.label) props['aria-label'] = o.label;
  if (o.pressed !== undefined) props['aria-pressed'] = String(o.pressed);
  return h('button', props, o.icon && icon(o.icon), text);
}

export function iconButton(name: IconName, label: string, onClick: () => void): HTMLButtonElement {
  return h('button', { type: 'button', class: 'btn icon-btn', 'aria-label': label, title: label, onclick: onClick }, icon(name));
}

interface ScreenOptions {
  title?: string;
  back?: () => void;
  home?: () => void;
  center?: boolean;
  /** A game: app updates wait until it is over. */
  session?: boolean;
}

/** A screen with an optional top bar. Returns the screen and its body to fill. */
export function screen(o: ScreenOptions = {}): { view: HTMLElement; body: HTMLElement } {
  const body = h('div', { class: `screen__body${o.center ? ' screen__body--center' : ''}` });
  const hasBar = o.title || o.back || o.home;
  const view = h(
    'main',
    { class: `screen${o.session ? ' session' : ''}` },
    hasBar &&
      h(
        'header',
        { class: 'topbar' },
        o.back ? iconButton('back', 'Tillbaka', o.back) : h('span', { class: 'topbar__spacer' }),
        o.title && h('span', { class: 'topbar__title' }, o.title),
        o.home ? iconButton('home', 'Till skogen', o.home) : h('span', { class: 'topbar__spacer' }),
      ),
    body,
  );
  return { view, body };
}

/**
 * The owl with a speech bubble. With a Swedish voice on the device, the text can be read aloud;
 * `say` may mix languages (a glosa in English) and each part is read in its own language.
 */
export function guide(ctx: AppContext, mood: OwlMood, say: Spoken | readonly Spoken[], content?: Child): HTMLElement {
  const parts = (Array.isArray(say) ? say : [say]) as readonly Spoken[];
  const text = content ?? parts.map((p) => (typeof p === 'string' ? p : p.text)).join(' ');
  return h(
    'div',
    { class: 'guide' },
    owl(mood, 110),
    h(
      'div',
      { class: 'bubble' },
      h('span', { class: 'bubble__text', 'aria-live': 'polite' }, text),
      ctx.canSpeak &&
        h('button', { type: 'button', class: 'btn bubble__speak', 'aria-label': 'Läs upp', title: 'Läs upp', onclick: () => void speak(say) }, icon('listen', 24)),
    ),
  );
}

export function dots(total: number, current: number): HTMLElement {
  return h(
    'div',
    { class: 'dots', 'aria-label': `${Math.min(current + 1, total)} av ${total}` },
    Array.from({ length: total }, (_, i) => h('span', { class: `dot${i < current ? ' dot--done' : i === current ? ' dot--current' : ''}` })),
  );
}

export function heading(text: string, current: number, total: number): HTMLElement {
  return h('div', { class: 'phase-head' }, h('h2', null, text), dots(total, current));
}
