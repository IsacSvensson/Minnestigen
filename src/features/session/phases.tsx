// The phases of a session other than Dagens verktyg: warm-up, reflection and the closing mission.

import { useState } from 'react';
import type { MemoryItem, StrategyChoice, Reflection } from '../../engine/types';
import { Owl } from '../../graphics/Owl';
import { Button, Dots, Guide } from '../../ui/components';
import { HideAndSay, StudyCard, type CardResult } from '../modes/HideAndSay';
import { PictureRecall, type RecallResult } from '../modes/PictureRecall';
import type { Ratio } from '../../engine/metrics';

export type ItemResult = { item: MemoryItem } & ({ kind: 'card'; card: CardResult } | { kind: 'pictureSet'; recall: RecallResult });

/** Uppvärmning: plocka fram what the schedule says is due. */
export function Warmup({ items, onResult, onDone }: { items: MemoryItem[]; onResult: (r: ItemResult) => void; onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const item = items[index];
  if (!item) return null;
  const next = () => (index + 1 < items.length ? setIndex(index + 1) : onDone());

  return (
    <>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Plocka fram</h2>
        <Dots total={items.length} current={index} />
      </div>
      {item.content.kind === 'card' ? (
        <HideAndSay
          key={item.id}
          item={item}
          onDone={(card) => {
            onResult({ item, kind: 'card', card });
            next();
          }}
        />
      ) : (
        <PictureRecall
          key={item.id}
          target={item.content.pictureIds}
          prompt="Minns du bilderna från förra gången? Tryck på dem du kommer ihåg."
          onDone={(recall) => {
            onResult({ item, kind: 'pictureSet', recall });
            next();
          }}
        />
      )}
    </>
  );
}

/** Dagens verktyg, steg 1: titta on all new cards, then göm–säg–kolla on each. */
export function LearnCards({ items, onResult, onDone }: { items: MemoryItem[]; onResult: (r: ItemResult) => void; onDone: () => void }) {
  const [stage, setStage] = useState<'study' | 'recall'>('study');
  const [index, setIndex] = useState(0);
  const item = items[index];

  if (!item) {
    return (
      <div className="screen__body screen__body--center">
        <Owl mood="happy" size={160} />
        <h2>Allt är redan inlärt!</h2>
        <p className="muted">Be en vuxen lägga in nya ord i vuxenläget.</p>
        <Button variant="primary" big onClick={onDone}>
          Vidare
        </Button>
      </div>
    );
  }

  const advance = () => {
    if (index + 1 < items.length) return setIndex(index + 1);
    if (stage === 'study') {
      setStage('recall');
      setIndex(0);
    } else {
      onDone();
    }
  };

  return (
    <>
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>{stage === 'study' ? 'Titta' : 'Göm och säg'}</h2>
        <Dots total={items.length} current={index} />
      </div>
      {stage === 'study' ? (
        <StudyCard key={`s-${item.id}`} item={item} onNext={advance} />
      ) : (
        <HideAndSay
          key={`r-${item.id}`}
          item={item}
          onDone={(card) => {
            onResult({ item, kind: 'card', card });
            advance();
          }}
        />
      )}
    </>
  );
}

const STRATEGIES: { id: StrategyChoice; label: string }[] = [
  { id: 'repeat', label: 'Jag sa det tyst för mig själv' },
  { id: 'picture', label: 'Jag gjorde en bild i huvudet' },
  { id: 'group', label: 'Jag delade upp i grupper' },
  { id: 'story', label: 'Jag hittade på en berättelse' },
  { id: 'nothing', label: 'Inget särskilt' },
  { id: 'dontKnow', label: 'Vet inte' },
];

const HELPED: { id: Reflection['helped']; label: string }[] = [
  { id: 'yes', label: 'Ja' },
  { id: 'some', label: 'Lite' },
  { id: 'no', label: 'Nej' },
  { id: 'dontKnow', label: 'Vet inte' },
];

/** Reflektion: a question about the strategy, not about points. */
export function ReflectionPhase({ onDone }: { onDone: (r: Pick<Reflection, 'strategy' | 'helped'>) => void }) {
  const [strategy, setStrategy] = useState<StrategyChoice | null>(null);

  if (!strategy) {
    return (
      <>
        <Guide mood="thinking" say="Vilket knep använde du för att komma ihåg?">
          Vilket knep använde du för att komma ihåg?
        </Guide>
        <div className="choices">
          {STRATEGIES.map((s) => (
            <Button key={s.id} className="choice" onClick={() => (s.id === 'nothing' || s.id === 'dontKnow' ? onDone({ strategy: s.id, helped: 'dontKnow' }) : setStrategy(s.id))}>
              {s.label}
            </Button>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <Guide mood="thinking" say="Hjälpte det?">
        Hjälpte det?
      </Guide>
      <div className="numbers" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        {HELPED.map((h) => (
          <Button key={h.id} big onClick={() => onDone({ strategy, helped: h.id })}>
            {h.label}
          </Button>
        ))}
      </div>
    </>
  );
}

/** Avslut: long-term memory headline, the lantern, and a vardagsuppdrag. */
export function MissionPhase({ text, headline, onDone }: { text: string; headline: Ratio | null; onDone: () => void }) {
  return (
    <div className="screen__body screen__body--center">
      <div className="pop">
        <Owl mood="cheer" size={170} />
      </div>
      {headline ? (
        <h2>
          Du kom ihåg {headline.recalled} av {headline.total} från förra veckan!
        </h2>
      ) : (
        <h2>I morgon kollar vi vad du minns!</h2>
      )}
      <p className="muted">Du tände en ny lykta i Mönsterskogen.</p>
      <div className="card" style={{ textAlign: 'left', width: '100%' }}>
        <h3>Vardagsuppdrag</h3>
        <p style={{ margin: 0 }}>{text}</p>
      </div>
      <Button variant="primary" big wide icon="home" onClick={onDone}>
        Tillbaka till skogen
      </Button>
    </div>
  );
}

