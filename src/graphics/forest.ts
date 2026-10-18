// Mönsterskogen – the first area of the game world (Minnesväktarna). Knowledge is fading from the
// forest; every completed session lights one lantern along the path. Lanterns track participation,
// never performance, so a child can never get stuck for remembering poorly (docs/04-appkoncept.md, E8).

import { svgMarkup } from '../shell/dom';
import { AMBER, AMBER_LIGHT, BARK, CREAM, FOREST_500, FOREST_700, FOREST_900, INK, MOSS } from './palette';

type Point = readonly [number, number];
type Segment = readonly [Point, Point, Point, Point];

// The path as four cubic segments, bottom (start) to top. Each segment's first control point mirrors
// the previous segment's last one, so the curve is smooth.
const SEGMENTS: readonly Segment[] = [
  [[200, 620], [105, 575], [105, 520], [200, 495]],
  [[200, 495], [295, 470], [300, 420], [205, 392]],
  [[205, 392], [110, 364], [100, 316], [195, 284]],
  [[195, 284], [290, 252], [280, 190], [210, 150]],
];

const PATH_D =
  `M ${SEGMENTS[0]![0].join(' ')} ` +
  SEGMENTS.map(([, c1, c2, p]) => `C ${c1.join(' ')}, ${c2.join(' ')}, ${p.join(' ')}`).join(' ');

function bezier([p0, c1, c2, p3]: Segment, t: number): Point {
  const u = 1 - t;
  const f = (i: 0 | 1) => u * u * u * p0[i] + 3 * u * u * t * c1[i] + 3 * u * t * t * c2[i] + t * t * t * p3[i];
  return [f(0), f(1)];
}

export const LANTERN_COUNT = 8;
/** Lanterns start where the path comes out from under the start button. */
const FIRST_LANTERN_T = 0.7;

/**
 * Lantern positions, evenly spaced by arc length from FIRST_LANTERN_T on the first segment to the
 * end of the path, nudged off the path to alternating sides.
 */
const LANTERNS: readonly Point[] = (() => {
  const samples: Point[] = [];
  SEGMENTS.forEach((segment, si) => {
    for (let i = si === 0 ? Math.round(FIRST_LANTERN_T * 100) : 1; i <= 100; i++) samples.push(bezier(segment, i / 100));
  });
  const lengths = [0];
  for (let i = 1; i < samples.length; i++) {
    const [ax, ay] = samples[i - 1]!;
    const [bx, by] = samples[i]!;
    lengths.push(lengths[i - 1]! + Math.hypot(bx - ax, by - ay));
  }
  const total = lengths.at(-1)!;
  return Array.from({ length: LANTERN_COUNT }, (_, n) => {
    const target = (n / (LANTERN_COUNT - 1)) * total;
    const [x, y] = samples[lengths.findIndex((l) => l >= target)]!;
    const side = n % 2 === 0 ? -1 : 1;
    return [x + side * 28, y + 4] as const;
  });
})();

const roundTree = (x: number, y: number, s = 1, tone = FOREST_500) => `
  <g transform="translate(${x} ${y}) scale(${s})" stroke="${INK}" stroke-width="3" stroke-linejoin="round">
    <path d="M-5 0 L -4 -26 L 4 -26 L 5 0 Z" fill="${BARK}"/>
    <path d="M0 -78 C -26 -78, -34 -56, -28 -42 C -38 -34, -30 -16, -14 -20 C -8 -12, 8 -12, 14 -20 C 30 -16, 38 -34, 28 -42 C 34 -56, 26 -78, 0 -78 Z" fill="${tone}"/>
    <path d="M-14 -58 C -12 -64, -6 -68, 0 -68" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="4" stroke-linecap="round"/>
  </g>`;

const pine = (x: number, y: number, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})" stroke="${INK}" stroke-width="3" stroke-linejoin="round">
    <path d="M-4 0 L -4 -14 L 4 -14 L 4 0 Z" fill="${BARK}"/>
    <path d="M0 -84 L 18 -50 L 9 -50 L 26 -14 L -26 -14 L -9 -50 L -18 -50 Z" fill="${FOREST_700}"/>
  </g>`;

const lantern = ([x, y]: Point, lit: boolean) => `
  <g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})" class="lantern${lit ? ' lantern--lit' : ''}">
    ${lit ? `<circle r="26" cy="-20" fill="${AMBER_LIGHT}" opacity="0.45"/>` : ''}
    <g stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">
      <path d="M0 0 L 0 -12" fill="none"/>
      <ellipse cx="0" cy="1" rx="9" ry="3.5" fill="#8b8378"/>
      <path d="M-7 -12 L 7 -12 L 9 -30 L -9 -30 Z" fill="${lit ? AMBER : '#cfc6b8'}"/>
      <path d="M-11 -30 L 11 -30 L 0 -40 Z" fill="${lit ? '#b8562f' : '#9a9184'}"/>
      ${lit ? '<path d="M0 -15 C -4 -19, -2 -24, 0 -27 C 2 -24, 4 -19, 0 -15 Z" fill="#fff6d8" stroke-width="1.5"/>' : ''}
    </g>
  </g>`;

export function forestScene(litLanterns: number): SVGSVGElement {
  const markup = `
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#cfe8e4"/><stop offset="0.55" stop-color="${CREAM}"/>
      </linearGradient>
    </defs>
    <rect x="-300" width="1000" height="600" fill="url(#sky)"/>
    <path d="M-300 140 C -200 110, -100 120, 0 150 C 60 110, 120 120, 180 140 C 240 110, 330 100, 400 130 C 500 100, 600 120, 700 140 L 700 600 L -300 600 Z" fill="#cfe2c0"/>
    <path d="M-300 200 C -200 170, -80 190, 0 210 C 80 170, 150 190, 220 200 C 290 170, 350 180, 400 190 C 500 170, 600 180, 700 200 L 700 600 L -300 600 Z" fill="${MOSS}"/>
    <path d="M-300 290 C -200 270, -90 280, 0 300 C 90 270, 170 290, 260 280 C 320 270, 370 280, 400 290 C 500 270, 600 290, 700 280 L 700 600 L -300 600 Z" fill="#8fbb7a"/>
    ${pine(-250, 190, 0.6)}${roundTree(-170, 200, 0.7, '#6f9f6b')}${pine(-90, 210, 0.65)}
    ${roundTree(480, 190, 0.7, '#6f9f6b')}${pine(560, 200, 0.6)}${roundTree(640, 195, 0.65, '#6f9f6b')}
    ${pine(40, 200, 0.7)}${roundTree(330, 180, 0.7, '#6f9f6b')}${pine(370, 200, 0.6)}
    ${roundTree(-220, 330, 0.9)}${pine(-130, 340, 0.9)}${roundTree(-40, 360, 0.85, FOREST_700)}
    ${pine(450, 340, 0.9)}${roundTree(540, 330, 0.9)}${pine(630, 350, 0.85)}
    ${roundTree(90, 300, 0.85)}${pine(320, 300, 0.85)}
    <path d="${PATH_D}" fill="none" stroke="#c9a978" stroke-width="38" stroke-linecap="round"/>
    <path d="${PATH_D}" fill="none" stroke="#e6cf9f" stroke-width="28" stroke-linecap="round"/>
    <path d="${PATH_D}" fill="none" stroke="#f4e6c4" stroke-width="4" stroke-dasharray="2 18" stroke-linecap="round"/>
    ${LANTERNS.map((p, i) => lantern(p, i < litLanterns)).join('')}
    ${roundTree(350, 470, 1.1)}${pine(40, 420, 1.05)}${roundTree(30, 600, 1.4, FOREST_700)}${pine(375, 610, 1.3)}
    ${pine(-200, 470, 1.1)}${roundTree(-80, 520, 1.2)}${roundTree(-260, 600, 1.4, FOREST_700)}
    ${roundTree(480, 500, 1.15)}${pine(600, 470, 1.1)}${roundTree(660, 600, 1.4, FOREST_700)}
    <g fill="none" stroke="${FOREST_900}" stroke-width="3" stroke-linecap="round">
      <path d="M120 560 l -4 -14 M126 560 l 0 -18 M132 560 l 4 -14"/>
      <path d="M280 520 l -4 -12 M286 520 l 0 -16 M292 520 l 4 -12"/>
      <path d="M150 330 l -3 -10 M155 330 l 0 -13 M160 330 l 3 -10"/>
    </g>`;
  const lit = Math.min(litLanterns, LANTERN_COUNT);
  // Wider than the path: phones show the middle, wide screens see more forest on the sides
  // instead of losing the top and bottom of the path.
  return svgMarkup('-300 0 1000 600', markup, `Mönsterskogen, ${lit} av ${LANTERN_COUNT} lyktor tända`, {
    preserveAspectRatio: 'xMidYMid slice',
    width: '100%',
    height: '100%',
  });
}
