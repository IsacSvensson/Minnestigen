// Gissning vs utfall as two hand-drawn jars filling up with glow. Feedback on calibration, not a score.

import { h, svgMarkup } from '../shell/dom';
import { AMBER, FOREST_500, INK, PAPER } from './palette';

function jar(value: number, total: number, color: string, label: string): HTMLElement {
  const height = 120;
  const fill = (value / total) * (height - 8);
  const ticks = Array.from({ length: total - 1 }, (_, i) => {
    const y = 20 + height - 4 - ((i + 1) / total) * (height - 8);
    return `<path d="M14 ${y} L 24 ${y}" stroke="${INK}" stroke-opacity="0.35" stroke-width="2"/>`;
  }).join('');
  const art = svgMarkup(
    '0 0 80 150',
    `<rect x="10" y="20" width="60" height="${height}" rx="14" fill="${PAPER}" stroke="${INK}" stroke-width="3.5"/>
     <rect x="14" y="${20 + height - 4 - fill}" width="52" height="${fill}" rx="10" fill="${color}"/>
     ${ticks}
     <rect x="20" y="8" width="40" height="14" rx="5" fill="${INK}"/>`,
    undefined,
    { width: 80, height: 150 },
  );
  return h('figure', null, art, h('div', { class: 'jar-value' }, value), h('figcaption', { class: 'muted small' }, label));
}

export function calibrationJars(predicted: number, actual: number, total: number): HTMLElement {
  return h(
    'div',
    { class: 'bars', role: 'img', 'aria-label': `Gissning ${predicted}, kom ihåg ${actual} av ${total}` },
    jar(predicted, total, AMBER, 'Din gissning'),
    jar(actual, total, FOREST_500, 'Kom ihåg'),
  );
}
