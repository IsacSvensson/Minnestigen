// Ugglan – the guide character. "Förklara för ugglan" is the understanding check, and the owl
// asks the reflection question. Drawn by hand; moods change eyes, wings and pose.

import { AMBER, AMBER_LIGHT, BARK, CREAM, INK } from './palette';

export type OwlMood = 'happy' | 'thinking' | 'cheer' | 'sleepy';

interface OwlProps {
  mood?: OwlMood;
  size?: number;
  title?: string;
}

const outline = {
  stroke: INK,
  strokeWidth: 4,
  strokeLinejoin: 'round' as const,
  strokeLinecap: 'round' as const,
};

function Eye({ cx, mood }: { cx: number; mood: OwlMood }) {
  if (mood === 'sleepy') {
    return <path d={`M${cx - 15} 92 C ${cx - 8} 100, ${cx + 8} 100, ${cx + 15} 92`} fill="none" {...outline} />;
  }
  if (mood === 'cheer') {
    return <path d={`M${cx - 14} 96 C ${cx - 8} 84, ${cx + 8} 84, ${cx + 14} 96`} fill="none" {...outline} strokeWidth={5} />;
  }
  const look = mood === 'thinking' ? { dx: -5, dy: -6 } : { dx: 2, dy: 2 };
  return (
    <g>
      <circle cx={cx} cy={92} r={21} fill="#fff" {...outline} />
      <circle cx={cx + look.dx} cy={92 + look.dy} r={10} fill={INK} />
      <circle cx={cx + look.dx + 3.5} cy={92 + look.dy - 3.5} r={3.5} fill="#fff" />
    </g>
  );
}

export function Owl({ mood = 'happy', size = 160, title = 'Ugglan' }: OwlProps) {
  const wingsUp = mood === 'cheer';
  return (
    <svg viewBox="0 0 200 220" width={size} height={size * 1.1} role="img" aria-label={title}>
      {/* wings, behind the body */}
      <g {...outline} fill={BARK}>
        {wingsUp ? (
          <>
            <path d="M48 118 C 22 104, 12 74, 18 56 C 34 66, 48 88, 58 108 Z" />
            <path d="M152 118 C 178 104, 188 74, 182 56 C 166 66, 152 88, 142 108 Z" />
          </>
        ) : (
          <>
            <path d="M46 112 C 26 128, 26 164, 44 184 C 54 170, 58 140, 56 116 Z" />
            <path d="M154 112 C 174 128, 174 164, 156 184 C 146 170, 142 140, 144 116 Z" />
          </>
        )}
      </g>
      {/* body */}
      <path
        d="M100 40 C 58 40, 40 76, 42 118 C 44 166, 70 198, 100 198 C 130 198, 156 166, 158 118 C 160 76, 142 40, 100 40 Z"
        fill="#b27a4f"
        {...outline}
      />
      {/* ear tufts */}
      <g {...outline} fill="#b27a4f">
        <path d="M56 62 L 46 26 L 78 48 Z" />
        <path d="M144 62 L 154 26 L 122 48 Z" />
      </g>
      {/* belly with feather scallops */}
      <path d="M100 116 C 74 116, 64 140, 66 162 C 68 182, 84 192, 100 192 C 116 192, 132 182, 134 162 C 136 140, 126 116, 100 116 Z" fill={CREAM} {...outline} />
      <g fill="none" stroke="#d9c6a6" strokeWidth={3} strokeLinecap="round">
        <path d="M80 140 c 4 5, 10 5, 14 0 M106 140 c 4 5, 10 5, 14 0" />
        <path d="M74 158 c 4 5, 10 5, 14 0 M93 158 c 4 5, 10 5, 14 0 M112 158 c 4 5, 10 5, 14 0" />
        <path d="M84 176 c 4 5, 10 5, 14 0 M102 176 c 4 5, 10 5, 14 0" />
      </g>
      {/* face disc */}
      <path d="M100 66 C 84 62, 54 64, 52 92 C 52 116, 78 122, 100 112 C 122 122, 148 116, 148 92 C 146 64, 116 62, 100 66 Z" fill={AMBER_LIGHT} {...outline} />
      <Eye cx={76} mood={mood} />
      <Eye cx={124} mood={mood} />
      {/* beak */}
      <path d="M92 108 L 108 108 L 100 124 Z" fill={AMBER} {...outline} />
      {/* feet */}
      <g {...outline} fill={AMBER}>
        <path d="M78 196 c 0 8, 4 12, 8 12 c 2 -6, 4 -8, 8 -10 Z" />
        <path d="M122 196 c 0 8, -4 12, -8 12 c -2 -6, -4 -8, -8 -10 Z" />
      </g>
      {mood === 'thinking' && (
        <g {...outline} fill="#fff">
          <circle cx="170" cy="40" r="6" />
          <circle cx="182" cy="20" r="9" />
        </g>
      )}
    </svg>
  );
}
