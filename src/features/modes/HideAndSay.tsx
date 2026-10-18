// Göm och säg (steg 1): titta – göm – säg – kolla. The answer hides under a flap; the child says it
// aloud or picks it, can climb the hint ladder, and always sees the correct answer afterwards.

import { useMemo, useState } from 'react';
import type { CardContent, HintLevel, MemoryItem } from '../../engine/types';
import { availableHints } from '../../engine/scheduler';
import { Picture } from '../../graphics/pictures';
import { Icon } from '../../graphics/icons';
import { Button, Guide } from '../../ui/components';
import { shuffle } from '../../app/learning';

export interface CardResult {
  correct: boolean;
  hint: HintLevel;
}

type Phase = 'ask' | 'selfCheck' | 'feedback';

function HintView({ hint, card }: { hint: HintLevel; card: CardContent }) {
  if (hint === 'firstLetter') return <div className="hint">Börjar på: <b>{card.answer.charAt(0).toUpperCase()}…</b></div>;
  if (hint === 'place') return <div className="hint">Platsen: <b>{card.place}</b></div>;
  if (hint === 'picture' && card.pictureId)
    return (
      <div className="hint">
        <Picture id={card.pictureId} size={72} />
      </div>
    );
  return null;
}

function feedbackText(result: CardResult): string {
  if (result.correct && result.hint === 'none') return 'Du plockade fram det själv! Det är så minnet blir starkt.';
  if (result.correct) return 'Rätt med lite hjälp. Snyggt försök – vi tar den igen snart.';
  return 'Nu vet du svaret. Bra att du försökte först – vi tar den igen i morgon.';
}

export function HideAndSay({ item, onDone }: { item: MemoryItem; onDone: (result: CardResult) => void }) {
  const card = item.content as CardContent;
  const hints = useMemo(() => availableHints(item), [item]);
  // Picking only makes sense with at least two wrong options; otherwise the child says it aloud.
  const choices = useMemo(
    () => ((card.distractors?.length ?? 0) >= 2 ? shuffle([card.answer, ...card.distractors!.slice(0, 2)]) : []),
    [card],
  );
  const [phase, setPhase] = useState<Phase>('ask');
  const [hintCount, setHintCount] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [result, setResult] = useState<CardResult | null>(null);

  const hint: HintLevel = hintCount === 0 ? 'none' : hints[hintCount - 1]!;
  const shownHints = hints.slice(0, hintCount).filter((h) => h !== 'answer');

  const finish = (correct: boolean) => {
    setResult({ correct: correct && hint !== 'answer', hint });
    setPhase('feedback');
  };

  const nextHint = () => {
    const next = hintCount + 1;
    setHintCount(next);
    if (hints[next - 1] === 'answer') {
      setResult({ correct: false, hint: 'answer' });
      setPhase('feedback');
    }
  };

  const open = phase !== 'ask';

  return (
    <>
      {phase === 'ask' && (
        <Guide mood="thinking" say="Vad är svaret? Försök minnas innan du tittar.">
          Vad är svaret? Försök minnas innan du tittar.
        </Guide>
      )}
      {phase === 'selfCheck' && (
        <Guide mood="happy" say="Här är svaret. Sa du rätt?">
          Här är svaret. Sa du rätt?
        </Guide>
      )}
      {phase === 'feedback' && result && (
        <Guide mood={result.correct ? 'cheer' : 'happy'} say={feedbackText(result)}>
          {feedbackText(result)}
        </Guide>
      )}

      <div className="card flashcard">
        <div className="flashcard__prompt">{card.prompt}</div>
        <div className={`flashcard__flap ${open ? 'flashcard__flap--open pop' : 'flashcard__flap--hidden'}`}>
          {open ? (
            card.answer
          ) : (
            <span style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Icon name="eyeClosed" /> gömt
            </span>
          )}
        </div>
      </div>

      {shownHints.map((h) => (
        <HintView key={h} hint={h} card={card} />
      ))}

      {phase === 'ask' && (
        <>
          <div className="choices">
            {choices.map((choice) => (
              <Button
                key={choice}
                big
                className="choice"
                onClick={() => {
                  setPicked(choice);
                  finish(choice === card.answer);
                }}
              >
                {choice}
              </Button>
            ))}
          </div>
          <div className="row">
            <Button variant={choices.length ? 'ghost' : 'forest'} big={!choices.length} icon="speak" onClick={() => setPhase('selfCheck')}>
              Jag säger högt
            </Button>
            <Button variant="ghost" icon="hint" onClick={nextHint}>
              {hints[hintCount] === 'answer' ? 'Visa svaret' : 'Ledtråd'}
            </Button>
          </div>
        </>
      )}

      {phase === 'selfCheck' && (
        <div className="row">
          <Button variant="forest" big onClick={() => finish(true)}>
            Ja, rätt!
          </Button>
          <Button big onClick={() => finish(false)}>
            Inte riktigt
          </Button>
        </div>
      )}

      {phase === 'feedback' && result && (
        <>
          {picked && picked !== card.answer && (
            <p className="muted" style={{ textAlign: 'center', margin: 0 }}>
              Du valde <b>{picked}</b>. Rätt svar är <b>{card.answer}</b>.
            </p>
          )}
          <Button variant="primary" big wide icon="next" onClick={() => onDone(result)}>
            Vidare
          </Button>
        </>
      )}
    </>
  );
}

/** Titta: study the new cards with answers visible before they are hidden. */
export function StudyCard({ item, onNext }: { item: MemoryItem; onNext: () => void }) {
  const card = item.content as CardContent;
  return (
    <>
      <Guide say={`Titta och säg tyst för dig själv: ${card.prompt}, ${card.answer}.`}>
        Titta noga och säg det tyst för dig själv.
      </Guide>
      <div className="card flashcard">
        {card.pictureId && <Picture id={card.pictureId} size={96} />}
        <div className="flashcard__prompt">{card.prompt}</div>
        <div className="flashcard__flap flashcard__flap--open">{card.answer}</div>
      </div>
      <Button variant="primary" big wide icon="next" onClick={onNext}>
        Nästa
      </Button>
    </>
  );
}
