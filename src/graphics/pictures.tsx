// Custom picture catalog. Every picture is drawn here by hand in a 100×100 viewBox with the
// shared ink outline, so the set looks like one illustrated family. See docs/design/grafik.md.

import type { ReactElement } from 'react';
import { INK } from './palette';

const outline = {
  stroke: INK,
  strokeWidth: 3.5,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
};

/** A soft highlight that gives every object the same light source (top left). */
const Shine = ({ d }: { d: string }) => (
  <path d={d} fill="none" stroke="#fff" strokeOpacity={0.7} strokeWidth={4} strokeLinecap="round" />
);

const drawings: Record<string, { name: string; draw: () => ReactElement }> = {
  apple: {
    name: 'äpple',
    draw: () => (
      <g {...outline}>
        <path d="M50 30 C 34 20, 16 30, 18 52 C 20 74, 36 88, 50 82 C 64 88, 80 74, 82 52 C 84 30, 66 20, 50 30 Z" fill="#e5533d" />
        <path d="M50 30 C 50 22, 52 16, 56 12" fill="none" />
        <path d="M54 22 C 62 12, 74 12, 78 16 C 72 24, 62 26, 54 22 Z" fill="#6fae5a" />
        <Shine d="M30 44 C 31 38, 35 34, 40 33" />
      </g>
    ),
  },
  fish: {
    name: 'fisk',
    draw: () => (
      <g {...outline}>
        <path d="M14 50 C 26 28, 58 24, 74 50 C 58 76, 26 72, 14 50 Z" fill="#4fa3c7" />
        <path d="M72 50 L 90 34 C 92 44, 92 56, 90 66 Z" fill="#f2a93b" />
        <path d="M40 34 C 46 26, 56 26, 60 32" fill="#f2a93b" />
        <circle cx="30" cy="46" r="4.5" fill={INK} stroke="none" />
        <circle cx="31.5" cy="44.5" r="1.5" fill="#fff" stroke="none" />
        <path d="M44 42 C 48 48, 48 54, 44 60" fill="none" />
        <path d="M22 56 C 24 58, 27 58, 29 57" fill="none" />
      </g>
    ),
  },
  key: {
    name: 'nyckel',
    draw: () => (
      <g {...outline}>
        <circle cx="32" cy="50" r="18" fill="#f2c14e" />
        <circle cx="32" cy="50" r="7" fill="#fbf6ec" />
        <path d="M48 44 L 86 44 L 86 56 L 80 56 L 80 64 L 72 64 L 72 56 L 66 56 L 66 62 L 58 62 L 58 56 L 48 56 Z" fill="#f2c14e" />
        <Shine d="M22 40 C 24 36, 28 34, 32 34" />
      </g>
    ),
  },
  boat: {
    name: 'båt',
    draw: () => (
      <g {...outline}>
        <path d="M50 14 L 50 62" fill="none" />
        <path d="M52 18 C 66 28, 74 42, 76 56 L 52 56 Z" fill="#fbf6ec" />
        <path d="M48 24 C 38 34, 32 46, 30 56 L 48 56 Z" fill="#e86f51" />
        <path d="M14 62 L 86 62 C 82 76, 72 84, 58 84 L 42 84 C 28 84, 18 76, 14 62 Z" fill="#8a5a3c" />
        <path d="M8 90 C 18 84, 26 96, 36 90 C 46 84, 54 96, 64 90 C 74 84, 82 96, 92 90" fill="none" stroke="#4fa3c7" />
      </g>
    ),
  },
  hat: {
    name: 'hatt',
    draw: () => (
      <g {...outline}>
        <ellipse cx="50" cy="72" rx="40" ry="11" fill="#5b4a8a" />
        <path d="M28 70 L 30 30 C 30 22, 70 22, 70 30 L 72 70 C 64 76, 36 76, 28 70 Z" fill="#6f5da3" />
        <path d="M29.5 58 C 40 63, 60 63, 70.5 58 L 71 66 C 60 71, 40 71, 29 66 Z" fill="#e86f51" />
        <Shine d="M38 34 L 37 50" />
      </g>
    ),
  },
  sun: {
    name: 'sol',
    draw: () => (
      <g {...outline}>
        {Array.from({ length: 8 }, (_, i) => (
          <path
            key={i}
            d="M50 6 L 56 20 L 44 20 Z"
            fill="#f2a93b"
            transform={`rotate(${i * 45} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="24" fill="#f8cf4f" />
        <circle cx="42" cy="47" r="3" fill={INK} stroke="none" />
        <circle cx="58" cy="47" r="3" fill={INK} stroke="none" />
        <path d="M42 57 C 46 62, 54 62, 58 57" fill="none" />
      </g>
    ),
  },
  book: {
    name: 'bok',
    draw: () => (
      <g {...outline}>
        <path d="M50 26 C 40 18, 22 18, 12 22 L 12 78 C 22 74, 40 74, 50 82 Z" fill="#fbf6ec" />
        <path d="M50 26 C 60 18, 78 18, 88 22 L 88 78 C 78 74, 60 74, 50 82 Z" fill="#fffdf8" />
        <path d="M8 26 L 8 84 C 22 80, 40 80, 50 86 C 60 80, 78 80, 92 84 L 92 26" fill="none" stroke="#2f5d50" strokeWidth={5} />
        <path d="M20 36 L 40 36 M20 46 L 40 46 M20 56 L 34 56 M60 36 L 80 36 M60 46 L 80 46 M60 56 L 74 56" fill="none" strokeWidth={2.5} stroke="#b9ab97" />
      </g>
    ),
  },
  shoe: {
    name: 'sko',
    draw: () => (
      <g {...outline}>
        <path d="M14 40 L 36 40 C 40 52, 56 56, 72 58 C 84 60, 90 66, 90 74 L 90 78 L 12 78 C 10 64, 12 50, 14 40 Z" fill="#e86f51" />
        <path d="M12 78 L 90 78 L 90 84 L 12 84 Z" fill="#fbf6ec" />
        <path d="M40 50 L 46 44 M48 54 L 54 48 M56 57 L 61 51" fill="none" />
        <Shine d="M20 48 L 20 62" />
      </g>
    ),
  },
  ball: {
    name: 'boll',
    draw: () => {
      const colors = ['#e5533d', '#fbf6ec', '#4fa3c7', '#fbf6ec', '#f8cf4f', '#fbf6ec'];
      const at = (deg: number) => {
        const rad = ((deg - 90) * Math.PI) / 180;
        return `${50 + 34 * Math.cos(rad)} ${50 + 34 * Math.sin(rad)}`;
      };
      return (
        <g {...outline}>
          {colors.map((fill, i) => (
            <path key={i} d={`M50 50 L ${at(i * 60)} A 34 34 0 0 1 ${at(i * 60 + 60)} Z`} fill={fill} />
          ))}
          <circle cx="50" cy="50" r="7" fill="#fbf6ec" />
          <Shine d="M28 34 C 31 28, 36 24, 42 22" />
        </g>
      );
    },
  },
  cup: {
    name: 'kopp',
    draw: () => (
      <g {...outline}>
        <path d="M30 24 C 28 18, 34 16, 34 10 M44 24 C 42 18, 48 16, 48 10" fill="none" stroke="#b9ab97" />
        <path d="M70 42 C 86 40, 88 64, 70 64" fill="none" strokeWidth={6} />
        <path d="M70 42 C 86 40, 88 64, 70 64" fill="none" stroke="#6fae5a" strokeWidth={2} />
        <path d="M18 32 L 74 32 L 70 70 C 68 80, 24 80, 22 70 Z" fill="#6fae5a" />
        <ellipse cx="46" cy="32" rx="28" ry="6" fill="#8a5a3c" />
        <path d="M10 84 L 82 84" fill="none" />
      </g>
    ),
  },
  flower: {
    name: 'blomma',
    draw: () => (
      <g {...outline}>
        <path d="M50 54 L 50 92" fill="none" stroke="#2f5d50" strokeWidth={4} />
        <path d="M50 78 C 40 68, 28 70, 24 74 C 30 82, 42 82, 50 78 Z" fill="#6fae5a" />
        {Array.from({ length: 6 }, (_, i) => (
          <ellipse key={i} cx="50" cy="20" rx="11" ry="16" fill="#f08fb0" transform={`rotate(${i * 60} 50 38)`} />
        ))}
        <circle cx="50" cy="38" r="10" fill="#f8cf4f" />
      </g>
    ),
  },
  umbrella: {
    name: 'paraply',
    draw: () => (
      <g {...outline}>
        <path d="M50 50 L 50 82 C 50 90, 38 90, 38 82" fill="none" />
        <path d="M8 50 C 10 26, 30 12, 50 12 C 70 12, 90 26, 92 50 C 86 44, 78 44, 71 50 C 64 44, 56 44, 50 50 C 44 44, 36 44, 29 50 C 22 44, 14 44, 8 50 Z" fill="#8b5fbf" />
        <path d="M50 12 C 40 22, 32 36, 29 50 M50 12 C 60 22, 68 36, 71 50" fill="none" />
        <path d="M50 12 L 50 50" fill="none" />
      </g>
    ),
  },
  star: {
    name: 'stjärna',
    draw: () => (
      <g {...outline}>
        <path d="M50 8 L 61 36 L 91 38 L 68 57 L 76 87 L 50 70 L 24 87 L 32 57 L 9 38 L 39 36 Z" fill="#f8cf4f" />
        <circle cx="43" cy="50" r="3" fill={INK} stroke="none" />
        <circle cx="57" cy="50" r="3" fill={INK} stroke="none" />
        <path d="M45 59 C 48 62, 52 62, 55 59" fill="none" />
      </g>
    ),
  },
  clock: {
    name: 'klocka',
    draw: () => (
      <g {...outline}>
        <circle cx="26" cy="20" r="10" fill="#e86f51" />
        <circle cx="74" cy="20" r="10" fill="#e86f51" />
        <circle cx="50" cy="54" r="34" fill="#fbf6ec" />
        <circle cx="50" cy="54" r="34" fill="none" stroke="#e86f51" strokeWidth={6} />
        <circle cx="50" cy="54" r="34" fill="none" />
        <path d="M50 54 L 50 34 M50 54 L 64 62" fill="none" />
        <path d="M30 84 L 24 92 M70 84 L 76 92" fill="none" />
      </g>
    ),
  },
  balloon: {
    name: 'ballong',
    draw: () => (
      <g {...outline}>
        <path d="M50 70 C 46 78, 56 84, 50 94" fill="none" />
        <path d="M50 70 C 26 64, 20 40, 26 26 C 32 10, 68 10, 74 26 C 80 40, 74 64, 50 70 Z" fill="#e5533d" />
        <path d="M45 70 L 55 70 L 52 76 L 48 76 Z" fill="#e5533d" />
        <Shine d="M36 26 C 38 22, 42 20, 46 20" />
      </g>
    ),
  },
  carrot: {
    name: 'morot',
    draw: () => (
      <g {...outline}>
        <path d="M50 30 C 46 18, 36 12, 30 14 M50 30 C 50 18, 54 10, 60 8 M50 30 C 56 20, 66 18, 72 22" fill="none" stroke="#2f5d50" strokeWidth={5} />
        <path d="M36 32 C 42 26, 60 26, 64 32 C 66 50, 58 76, 50 92 C 42 76, 34 50, 36 32 Z" fill="#f0883a" />
        <path d="M40 44 L 47 46 M54 56 L 60 54 M44 66 L 50 68" fill="none" />
      </g>
    ),
  },
};

export const PICTURE_IDS = Object.keys(drawings);

export function pictureName(id: string): string {
  return drawings[id]?.name ?? id;
}

interface PictureProps {
  id: string;
  size?: number | string;
  title?: string;
}

export function Picture({ id, size = 96, title }: PictureProps) {
  const drawing = drawings[id];
  if (!drawing) return null;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={title ?? drawing.name}>
      {drawing.draw()}
    </svg>
  );
}
