// Recognition test for a picture set: the target pictures mixed with as many others. The child can
// pick at most as many as the set holds, so hits are a fair measure. Afterwards the correct
// pictures are always shown.

import { useMemo, useState } from 'react';
import { Picture } from '../../graphics/pictures';
import { Icon } from '../../graphics/icons';
import { Button, Guide } from '../../ui/components';
import { randomPictures, shuffle } from '../../app/learning';

export interface RecallResult {
  recalled: number;
  total: number;
}

interface PictureRecallProps {
  target: string[];
  prompt: string;
  onDone: (result: RecallResult) => void;
}

export function PictureRecall({ target, prompt, onDone }: PictureRecallProps) {
  const options = useMemo(() => shuffle([...target, ...randomPictures(target.length, target)]), [target]);
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const hits = selected.filter((id) => target.includes(id)).length;

  const toggle = (id: string) => {
    if (checked) return;
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length < target.length ? [...s, id] : s));
  };

  const tileClass = (id: string) => {
    const isTarget = target.includes(id);
    const isSelected = selected.includes(id);
    if (!checked) return isSelected ? 'tile tile--selected' : 'tile';
    if (isTarget && isSelected) return 'tile tile--hit';
    if (isTarget) return 'tile tile--missed';
    return 'tile tile--extra';
  };

  return (
    <>
      {checked ? (
        <Guide
          mood="happy"
          say={`Du hittade ${hits} av ${target.length}. Bra jobbat att försöka! De gröna var med.`}
        >
          Du hittade <b>{hits}</b> av {target.length}. Bra jobbat att försöka! De med grön kant var med.
        </Guide>
      ) : (
        <Guide mood="thinking" say={prompt}>
          {prompt}
        </Guide>
      )}
      <div className="picture-grid picture-grid--4">
        {options.map((id) => (
          <button
            key={id}
            type="button"
            className={tileClass(id)}
            aria-pressed={selected.includes(id)}
            onClick={() => toggle(id)}
          >
            <Picture id={id} />
            {checked && target.includes(id) && selected.includes(id) && (
              <span className="tile__badge">
                <Icon name="check" size={18} />
              </span>
            )}
          </button>
        ))}
      </div>
      <p className="muted small" style={{ textAlign: 'center', margin: 0 }}>
        {checked ? ' ' : `Valda: ${selected.length} av ${target.length}`}
      </p>
      {checked ? (
        <Button variant="primary" big wide icon="next" onClick={() => onDone({ recalled: hits, total: target.length })}>
          Vidare
        </Button>
      ) : (
        <Button variant="forest" big wide icon="check" disabled={selected.length === 0} onClick={() => setChecked(true)}>
          Kolla
        </Button>
      )}
    </>
  );
}
