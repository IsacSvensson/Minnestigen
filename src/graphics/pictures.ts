// Custom picture drawings. Every picture is drawn here by hand in a 100×100 viewBox with the
// shared ink outline, so the set looks like one illustrated family. See docs/design/grafik.md.

import type { PictureId } from '../content/pictures';
import { pictureName } from '../content/pictures';
import { svgMarkup } from '../shell/dom';
import { INK } from './palette';

const O = `stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"`;

/** A soft highlight that gives every object the same light source (top left). */
const shine = (d: string) => `<path d="${d}" fill="none" stroke="#fff" stroke-opacity="0.7" stroke-width="4" stroke-linecap="round"/>`;

const eye = (cx: number, cy: number) => `<circle cx="${cx}" cy="${cy}" r="3" fill="${INK}" stroke="none"/>`;

const range = (n: number) => Array.from({ length: n }, (_, i) => i);

const DRAWINGS: Record<PictureId, string> = {
  apple: `<g ${O}>
    <path d="M50 30 C 34 20, 16 30, 18 52 C 20 74, 36 88, 50 82 C 64 88, 80 74, 82 52 C 84 30, 66 20, 50 30 Z" fill="#e5533d"/>
    <path d="M50 30 C 50 22, 52 16, 56 12" fill="none"/>
    <path d="M54 22 C 62 12, 74 12, 78 16 C 72 24, 62 26, 54 22 Z" fill="#6fae5a"/>
    ${shine('M30 44 C 31 38, 35 34, 40 33')}
  </g>`,
  fish: `<g ${O}>
    <path d="M14 50 C 26 28, 58 24, 74 50 C 58 76, 26 72, 14 50 Z" fill="#4fa3c7"/>
    <path d="M72 50 L 90 34 C 92 44, 92 56, 90 66 Z" fill="#f2a93b"/>
    <path d="M40 34 C 46 26, 56 26, 60 32" fill="#f2a93b"/>
    <circle cx="30" cy="46" r="4.5" fill="${INK}" stroke="none"/>
    <circle cx="31.5" cy="44.5" r="1.5" fill="#fff" stroke="none"/>
    <path d="M44 42 C 48 48, 48 54, 44 60" fill="none"/>
    <path d="M22 56 C 24 58, 27 58, 29 57" fill="none"/>
  </g>`,
  key: `<g ${O}>
    <circle cx="32" cy="50" r="18" fill="#f2c14e"/>
    <circle cx="32" cy="50" r="7" fill="#fbf6ec"/>
    <path d="M48 44 L 86 44 L 86 56 L 80 56 L 80 64 L 72 64 L 72 56 L 66 56 L 66 62 L 58 62 L 58 56 L 48 56 Z" fill="#f2c14e"/>
    ${shine('M22 40 C 24 36, 28 34, 32 34')}
  </g>`,
  boat: `<g ${O}>
    <path d="M50 14 L 50 62" fill="none"/>
    <path d="M52 18 C 66 28, 74 42, 76 56 L 52 56 Z" fill="#fbf6ec"/>
    <path d="M48 24 C 38 34, 32 46, 30 56 L 48 56 Z" fill="#e86f51"/>
    <path d="M14 62 L 86 62 C 82 76, 72 84, 58 84 L 42 84 C 28 84, 18 76, 14 62 Z" fill="#8a5a3c"/>
    <path d="M8 90 C 18 84, 26 96, 36 90 C 46 84, 54 96, 64 90 C 74 84, 82 96, 92 90" fill="none" stroke="#4fa3c7"/>
  </g>`,
  hat: `<g ${O}>
    <ellipse cx="50" cy="72" rx="40" ry="11" fill="#5b4a8a"/>
    <path d="M28 70 L 30 30 C 30 22, 70 22, 70 30 L 72 70 C 64 76, 36 76, 28 70 Z" fill="#6f5da3"/>
    <path d="M29.5 58 C 40 63, 60 63, 70.5 58 L 71 66 C 60 71, 40 71, 29 66 Z" fill="#e86f51"/>
    ${shine('M38 34 L 37 50')}
  </g>`,
  sun: `<g ${O}>
    ${range(8)
      .map((i) => `<path d="M50 6 L 56 20 L 44 20 Z" fill="#f2a93b" transform="rotate(${i * 45} 50 50)"/>`)
      .join('')}
    <circle cx="50" cy="50" r="24" fill="#f8cf4f"/>
    ${eye(42, 47)}${eye(58, 47)}
    <path d="M42 57 C 46 62, 54 62, 58 57" fill="none"/>
  </g>`,
  book: `<g ${O}>
    <path d="M50 26 C 40 18, 22 18, 12 22 L 12 78 C 22 74, 40 74, 50 82 Z" fill="#fbf6ec"/>
    <path d="M50 26 C 60 18, 78 18, 88 22 L 88 78 C 78 74, 60 74, 50 82 Z" fill="#fffdf8"/>
    <path d="M8 26 L 8 84 C 22 80, 40 80, 50 86 C 60 80, 78 80, 92 84 L 92 26" fill="none" stroke="#2f5d50" stroke-width="5"/>
    <path d="M20 36 L 40 36 M20 46 L 40 46 M20 56 L 34 56 M60 36 L 80 36 M60 46 L 80 46 M60 56 L 74 56" fill="none" stroke-width="2.5" stroke="#b9ab97"/>
  </g>`,
  shoe: `<g ${O}>
    <path d="M14 40 L 36 40 C 40 52, 56 56, 72 58 C 84 60, 90 66, 90 74 L 90 78 L 12 78 C 10 64, 12 50, 14 40 Z" fill="#e86f51"/>
    <path d="M12 78 L 90 78 L 90 84 L 12 84 Z" fill="#fbf6ec"/>
    <path d="M40 50 L 46 44 M48 54 L 54 48 M56 57 L 61 51" fill="none"/>
    ${shine('M20 48 L 20 62')}
  </g>`,
  ball: (() => {
    const colors = ['#e5533d', '#fbf6ec', '#4fa3c7', '#fbf6ec', '#f8cf4f', '#fbf6ec'];
    const at = (deg: number) => {
      const rad = ((deg - 90) * Math.PI) / 180;
      return `${(50 + 34 * Math.cos(rad)).toFixed(2)} ${(50 + 34 * Math.sin(rad)).toFixed(2)}`;
    };
    return `<g ${O}>
      ${colors.map((fill, i) => `<path d="M50 50 L ${at(i * 60)} A 34 34 0 0 1 ${at(i * 60 + 60)} Z" fill="${fill}"/>`).join('')}
      <circle cx="50" cy="50" r="7" fill="#fbf6ec"/>
      ${shine('M28 34 C 31 28, 36 24, 42 22')}
    </g>`;
  })(),
  cup: `<g ${O}>
    <path d="M30 24 C 28 18, 34 16, 34 10 M44 24 C 42 18, 48 16, 48 10" fill="none" stroke="#b9ab97"/>
    <path d="M70 42 C 86 40, 88 64, 70 64" fill="none" stroke-width="6"/>
    <path d="M70 42 C 86 40, 88 64, 70 64" fill="none" stroke="#6fae5a" stroke-width="2"/>
    <path d="M18 32 L 74 32 L 70 70 C 68 80, 24 80, 22 70 Z" fill="#6fae5a"/>
    <ellipse cx="46" cy="32" rx="28" ry="6" fill="#8a5a3c"/>
    <path d="M10 84 L 82 84" fill="none"/>
  </g>`,
  flower: `<g ${O}>
    <path d="M50 54 L 50 92" fill="none" stroke="#2f5d50" stroke-width="4"/>
    <path d="M50 78 C 40 68, 28 70, 24 74 C 30 82, 42 82, 50 78 Z" fill="#6fae5a"/>
    ${range(6)
      .map((i) => `<ellipse cx="50" cy="20" rx="11" ry="16" fill="#f08fb0" transform="rotate(${i * 60} 50 38)"/>`)
      .join('')}
    <circle cx="50" cy="38" r="10" fill="#f8cf4f"/>
  </g>`,
  umbrella: `<g ${O}>
    <path d="M50 50 L 50 82 C 50 90, 38 90, 38 82" fill="none"/>
    <path d="M8 50 C 10 26, 30 12, 50 12 C 70 12, 90 26, 92 50 C 86 44, 78 44, 71 50 C 64 44, 56 44, 50 50 C 44 44, 36 44, 29 50 C 22 44, 14 44, 8 50 Z" fill="#8b5fbf"/>
    <path d="M50 12 C 40 22, 32 36, 29 50 M50 12 C 60 22, 68 36, 71 50" fill="none"/>
    <path d="M50 12 L 50 50" fill="none"/>
  </g>`,
  star: `<g ${O}>
    <path d="M50 8 L 61 36 L 91 38 L 68 57 L 76 87 L 50 70 L 24 87 L 32 57 L 9 38 L 39 36 Z" fill="#f8cf4f"/>
    ${eye(43, 50)}${eye(57, 50)}
    <path d="M45 59 C 48 62, 52 62, 55 59" fill="none"/>
  </g>`,
  clock: `<g ${O}>
    <circle cx="26" cy="20" r="10" fill="#e86f51"/>
    <circle cx="74" cy="20" r="10" fill="#e86f51"/>
    <circle cx="50" cy="54" r="34" fill="#fbf6ec"/>
    <circle cx="50" cy="54" r="34" fill="none" stroke="#e86f51" stroke-width="6"/>
    <circle cx="50" cy="54" r="34" fill="none"/>
    <path d="M50 54 L 50 34 M50 54 L 64 62" fill="none"/>
    <path d="M30 84 L 24 92 M70 84 L 76 92" fill="none"/>
  </g>`,
  balloon: `<g ${O}>
    <path d="M50 70 C 46 78, 56 84, 50 94" fill="none"/>
    <path d="M50 70 C 26 64, 20 40, 26 26 C 32 10, 68 10, 74 26 C 80 40, 74 64, 50 70 Z" fill="#e5533d"/>
    <path d="M45 70 L 55 70 L 52 76 L 48 76 Z" fill="#e5533d"/>
    ${shine('M36 26 C 38 22, 42 20, 46 20')}
  </g>`,
  carrot: `<g ${O}>
    <path d="M50 30 C 46 18, 36 12, 30 14 M50 30 C 50 18, 54 10, 60 8 M50 30 C 56 20, 66 18, 72 22" fill="none" stroke="#2f5d50" stroke-width="5"/>
    <path d="M36 32 C 42 26, 60 26, 64 32 C 66 50, 58 76, 50 92 C 42 76, 34 50, 36 32 Z" fill="#f0883a"/>
    <path d="M40 44 L 47 46 M54 56 L 60 54 M44 66 L 50 68" fill="none"/>
  </g>`,
};

export function picture(id: string, size?: number): SVGSVGElement {
  const markup = DRAWINGS[id as PictureId] ?? '';
  return svgMarkup('0 0 100 100', markup, pictureName(id), size ? { width: size, height: size } : { class: 'picture' });
}
