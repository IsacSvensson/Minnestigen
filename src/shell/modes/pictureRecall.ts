// Recognition test for a picture set: the target pictures mixed with as many others. The child can
// pick at most as many as the set holds, so hits are a fair measure. Afterwards the correct
// pictures are always shown.

import { randomPictures, shuffle } from '../../app/learning';
import { icon } from '../../graphics/icons';
import { picture } from '../../graphics/pictures';
import type { AppContext } from '../app';
import { fill, h } from '../dom';
import { button, guide } from '../ui';

export interface RecallResult {
  recalled: number;
  total: number;
}

export function pictureRecall(ctx: AppContext, mount: HTMLElement, target: readonly string[], prompt: string, onDone: (r: RecallResult) => void): void {
  const options = shuffle([...target, ...randomPictures(target.length, target)]);
  const selected = new Set<string>();
  let checked = false;

  const render = () => {
    const hits = [...selected].filter((id) => target.includes(id)).length;
    const tileClass = (id: string) => {
      const isTarget = target.includes(id);
      const isSelected = selected.has(id);
      if (!checked) return isSelected ? 'tile tile--selected' : 'tile';
      if (isTarget && isSelected) return 'tile tile--hit';
      if (isTarget) return 'tile tile--missed';
      return 'tile tile--extra';
    };
    const toggle = (id: string) => {
      if (checked) return;
      if (selected.has(id)) selected.delete(id);
      else if (selected.size < target.length) selected.add(id);
      render();
    };
    fill(
      mount,
      checked
        ? guide(ctx, 'happy', `Du hittade ${hits} av ${target.length}. Bra jobbat att försöka! De med grön kant var med.`, [
            'Du hittade ',
            h('b', null, hits),
            ` av ${target.length}. Bra jobbat att försöka! De med grön kant var med.`,
          ])
        : guide(ctx, 'thinking', prompt),
      h(
        'div',
        { class: 'picture-grid picture-grid--4' },
        options.map((id) =>
          h(
            'button',
            { type: 'button', class: tileClass(id), 'aria-pressed': String(selected.has(id)), onclick: () => toggle(id) },
            picture(id),
            checked && target.includes(id) && selected.has(id) && h('span', { class: 'tile__badge' }, icon('check', 18)),
          ),
        ),
      ),
      h('p', { class: 'muted small center' }, checked ? '' : `Valda: ${selected.size} av ${target.length}`),
      checked
        ? button('Vidare', { variant: 'primary', big: true, wide: true, icon: 'next', onClick: () => onDone({ recalled: hits, total: target.length }) })
        : button('Kolla', {
            variant: 'forest',
            big: true,
            wide: true,
            icon: 'check',
            disabled: selected.size === 0,
            onClick: () => {
              checked = true;
              render();
            },
          }),
    );
  };
  render();
}
