// Gissa och pröva (steg 0): look at six pictures, predict how many you will remember, get tested,
// compare prediction with outcome. Builds metamemory; the set comes back tomorrow.

import { useMemo, useState } from 'react';
import { Picture } from '../../graphics/pictures';
import { Owl } from '../../graphics/Owl';
import { Button, Guide } from '../../ui/components';
import { randomPictures } from '../../app/learning';
import { CalibrationBars } from './CalibrationBars';
import { PictureRecall, type RecallResult } from './PictureRecall';

export const SET_SIZE = 6;

export interface GuessAndTestResult {
  pictureIds: string[];
  predicted: number;
  recall: RecallResult;
  saysStrategyHelps: boolean;
}

type Phase = 'look' | 'guess' | 'pause' | 'test' | 'compare';

export function GuessAndTest({ onDone }: { onDone: (result: GuessAndTestResult) => void }) {
  const pictureIds = useMemo(() => randomPictures(SET_SIZE), []);
  const [phase, setPhase] = useState<Phase>('look');
  const [predicted, setPredicted] = useState<number | null>(null);
  const [recall, setRecall] = useState<RecallResult | null>(null);

  if (phase === 'look') {
    return (
      <>
        <Guide say="Titta på bilderna så länge du vill. Tryck sen på Klar.">
          Titta på bilderna så länge du vill. Tryck sen på <b>Klar</b>.
        </Guide>
        <div className="picture-grid">
          {pictureIds.map((id) => (
            <div key={id} className="tile">
              <Picture id={id} />
            </div>
          ))}
        </div>
        <Button variant="primary" big wide icon="check" onClick={() => setPhase('guess')}>
          Klar
        </Button>
      </>
    );
  }

  if (phase === 'guess') {
    return (
      <>
        <Guide mood="thinking" say="Hur många av de sex bilderna tror du att du kommer ihåg?">
          Hur många av de sex bilderna tror du att du kommer ihåg?
        </Guide>
        <div className="numbers" role="group" aria-label="Din gissning">
          {Array.from({ length: SET_SIZE + 1 }, (_, n) => (
            <Button
              key={n}
              big
              variant={predicted === n ? 'primary' : 'plain'}
              aria-pressed={predicted === n}
              onClick={() => setPredicted(n)}
            >
              {n}
            </Button>
          ))}
        </div>
        <Button variant="forest" big wide disabled={predicted === null} onClick={() => setPhase('pause')}>
          Det är min gissning
        </Button>
      </>
    );
  }

  if (phase === 'pause') {
    // A short break so the test is not just reading off what is still in view.
    return (
      <div className="screen__body screen__body--center">
        <Owl mood="sleepy" size={180} />
        <h2>Blunda och räkna till fem</h2>
        <p className="muted">Bilderna är gömda nu.</p>
        <Button variant="primary" big onClick={() => setPhase('test')}>
          Nu kör vi!
        </Button>
      </div>
    );
  }

  if (phase === 'test' || !recall) {
    return (
      <PictureRecall
        target={pictureIds}
        prompt="Vilka bilder såg du? Tryck på dem du kommer ihåg."
        onDone={(r) => {
          setRecall(r);
          setPhase('compare');
        }}
      />
    );
  }

  return (
    <>
      <Guide
        mood="happy"
        say={`Du gissade ${predicted} och kom ihåg ${recall.recalled}. Tror du att man kan göra något för att komma ihåg fler?`}
      >
        Du gissade <b>{predicted}</b> och kom ihåg <b>{recall.recalled}</b>. Tror du att man kan göra något för att
        komma ihåg fler?
      </Guide>
      <CalibrationBars predicted={predicted ?? 0} actual={recall.recalled} total={SET_SIZE} />
      <div className="row">
        <Button variant="forest" big onClick={() => onDone({ pictureIds, predicted: predicted ?? 0, recall, saysStrategyHelps: true })}>
          Ja!
        </Button>
        <Button big onClick={() => onDone({ pictureIds, predicted: predicted ?? 0, recall, saysStrategyHelps: false })}>
          Vet inte
        </Button>
      </div>
    </>
  );
}
