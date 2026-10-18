// Gissning vs utfall as two hand-drawn jars filling up with glow. Feedback on calibration, not a score.

import { AMBER, FOREST_500, INK, PAPER } from '../../graphics/palette';

function Jar({ value, total, color, label }: { value: number; total: number; color: string; label: string }) {
  const height = 120;
  const fill = (value / total) * (height - 8);
  return (
    <figure>
      <svg viewBox="0 0 80 150" width={80} height={150} aria-hidden="true">
        <rect x={10} y={20} width={60} height={height} rx={14} fill={PAPER} stroke={INK} strokeWidth={3.5} />
        <rect x={14} y={20 + height - 4 - fill} width={52} height={fill} rx={10} fill={color} />
        {Array.from({ length: total - 1 }, (_, i) => {
          const y = 20 + height - 4 - ((i + 1) / total) * (height - 8);
          return <path key={i} d={`M14 ${y} L 24 ${y}`} stroke={INK} strokeOpacity={0.35} strokeWidth={2} />;
        })}
        <rect x={20} y={8} width={40} height={14} rx={5} fill={INK} />
      </svg>
      <div style={{ fontSize: '2rem', lineHeight: 1 }}>{value}</div>
      <figcaption className="muted small">{label}</figcaption>
    </figure>
  );
}

export function CalibrationBars({ predicted, actual, total }: { predicted: number; actual: number; total: number }) {
  return (
    <div className="bars" role="img" aria-label={`Gissning ${predicted}, kom ihåg ${actual} av ${total}`}>
      <Jar value={predicted} total={total} color={AMBER} label="Din gissning" />
      <Jar value={actual} total={total} color={FOREST_500} label="Kom ihåg" />
    </div>
  );
}
