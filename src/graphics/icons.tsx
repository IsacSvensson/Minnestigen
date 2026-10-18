// Custom icon set, 32×32 grid, rounded 3px strokes in currentColor so icons follow text colour.

import type { ReactElement } from 'react';

const paths = {
  back: <path d="M19 7 L 10 16 L 19 25" />,
  next: <path d="M13 7 L 22 16 L 13 25" />,
  home: (
    <>
      <path d="M5 15 L 16 6 L 27 15" />
      <path d="M8 13 L 8 26 L 24 26 L 24 13" />
      <path d="M13 26 L 13 19 L 19 19 L 19 26" />
    </>
  ),
  hint: (
    <>
      <path d="M11 20 C 7 17, 7 8, 16 6 C 25 8, 25 17, 21 20 L 21 23 L 11 23 Z" />
      <path d="M12 27 L 20 27" />
    </>
  ),
  eyeClosed: (
    <>
      <path d="M4 14 C 9 21, 23 21, 28 14" />
      <path d="M8 18 L 6 22 M16 20 L 16 24 M24 18 L 26 22" />
    </>
  ),
  check: <path d="M6 17 L 13 24 L 26 9" />,
  retry: (
    <>
      <path d="M25 16 A 9 9 0 1 1 22 9" />
      <path d="M23 4 L 23 10 L 17 10" />
    </>
  ),
  speak: (
    <>
      <path d="M6 9 C 6 6, 8 5, 11 5 L 21 5 C 24 5, 26 6, 26 9 L 26 17 C 26 20, 24 21, 21 21 L 14 21 L 8 26 L 9 21 C 7 21, 6 20, 6 17 Z" />
      <path d="M11 11 L 21 11 M11 15 L 17 15" />
    </>
  ),
  listen: (
    <>
      <path d="M5 12 L 10 12 L 17 6 L 17 26 L 10 20 L 5 20 Z" />
      <path d="M21 12 C 23 14, 23 18, 21 20 M24.5 8.5 C 29 12.5, 29 19.5, 24.5 23.5" />
    </>
  ),
  grown: (
    <>
      <circle cx="16" cy="11" r="5" />
      <path d="M6 27 C 6 20, 10 17, 16 17 C 22 17, 26 20, 26 27" />
    </>
  ),
  leaf: (
    <>
      <path d="M7 25 C 5 13, 13 5, 26 6 C 27 19, 19 27, 7 25 Z" />
      <path d="M7 25 L 18 14" />
    </>
  ),
  plus: <path d="M16 7 L 16 25 M7 16 L 25 16" />,
  trash: (
    <>
      <path d="M6 9 L 26 9 M13 9 L 13 5 L 19 5 L 19 9" />
      <path d="M8 9 L 10 27 L 22 27 L 24 9" />
    </>
  ),
} satisfies Record<string, ReactElement>;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 28 }: { name: IconName; size?: number }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
