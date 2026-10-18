// Vuxenläget: behind a simple adult gate. Child profile, Skolkopplingen (school lists), the learning
// profile, and data controls.

import { useMemo, useState } from 'react';
import { useApp } from '../../app/AppState';
import { parseCardLines } from '../../app/learning';
import { calibrationBias, delayedRecall, meanHintSteps, recallIn } from '../../engine/metrics';
import { STEPS } from '../../engine/progression';
import type { StepId } from '../../engine/types';
import { Button, IconButton, Screen } from '../../ui/components';

/** Steps with a playable game mode in this build. */
const PLAYABLE_STEPS: StepId[] = [0, 1];

function AdultGate({ onPass, onCancel }: { onPass: () => void; onCancel: () => void }) {
  const [a] = useState(() => 11 + Math.floor(Math.random() * 8));
  const [b] = useState(() => 3 + Math.floor(Math.random() * 6));
  const [answer, setAnswer] = useState('');
  return (
    <Screen title="För vuxna" onBack={onCancel}>
      <div className="card stack">
        <p style={{ margin: 0 }}>Svara för att fortsätta:</p>
        <label className="field">
          Vad är {a} × {b}?
          <input inputMode="numeric" value={answer} onChange={(e) => setAnswer(e.target.value)} autoFocus />
        </label>
        <Button variant="forest" disabled={Number(answer) !== a * b} onClick={onPass}>
          Fortsätt
        </Button>
      </div>
    </Screen>
  );
}

function percent(r: { recalled: number; total: number }): string {
  return r.total === 0 ? '–' : `${Math.round((r.recalled / r.total) * 100)} % (${r.recalled}/${r.total})`;
}

export function ParentArea({ onExit }: { onExit: () => void }) {
  const { data, actions } = useApp();
  const [unlocked, setUnlocked] = useState(false);
  const [title, setTitle] = useState('');
  const [lines, setLines] = useState('');
  const parsed = useMemo(() => parseCardLines(lines), [lines]);

  if (!unlocked) return <AdultGate onPass={() => setUnlocked(true)} onCancel={onExit} />;
  const profile = data.profile!;
  const bias = calibrationBias(data.calibrations);
  const hints = meanHintSteps(data.attempts.filter((a) => a.context === 'review'));

  return (
    <Screen title="Vuxenläge" onBack={onExit}>
      <section className="card stack">
        <h2>Barnet</h2>
        <label className="field">
          Namn
          <input value={profile.name} onChange={(e) => actions.updateChild({ name: e.target.value })} maxLength={24} />
        </label>
        <label className="field">
          Steg på stigen
          <select
            value={profile.currentStep}
            onChange={(e) => actions.updateChild({ currentStep: Number(e.target.value) as StepId })}
          >
            {PLAYABLE_STEPS.map((id) => (
              <option key={id} value={id}>
                Steg {id} – {STEPS[id]!.name}
              </option>
            ))}
          </select>
        </label>
        <p className="muted small" style={{ margin: 0 }}>
          {STEPS[profile.currentStep]!.goal} Går vidare när: {STEPS[profile.currentStep]!.advanceWhen}
        </p>
      </section>

      <section className="card stack">
        <h2>Skolkopplingen</h2>
        <p className="small muted" style={{ margin: 0 }}>
          Lägg in veckans glosor, tabeller eller begrepp. En rad per kort: <code>fråga = svar</code>. Skolans listor
          kommer före appens egna.
        </p>
        <label className="field">
          Listans namn
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Veckans glosor v. 43" />
        </label>
        <label className="field">
          Kort
          <textarea value={lines} onChange={(e) => setLines(e.target.value)} placeholder={'hund = dog\nkatt = cat\n7 · 8 = 56'} />
        </label>
        <Button
          variant="forest"
          icon="plus"
          disabled={!title.trim() || parsed.length === 0}
          onClick={() => {
            actions.addDeck({ title: title.trim(), cards: parsed });
            setTitle('');
            setLines('');
          }}
        >
          Lägg till {parsed.length > 0 ? `${parsed.length} kort` : 'lista'}
        </Button>
        {data.customDecks.map((deck) => (
          <div key={deck.id} className="stat" style={{ alignItems: 'center' }}>
            <span>
              {deck.title} <span className="muted">· {deck.cards.length} kort</span>
            </span>
            <IconButton icon="trash" label={`Ta bort ${deck.title}`} onClick={() => actions.removeDeck(deck.id)} />
          </div>
        ))}
      </section>

      <section className="card stack">
        <h2>Lärandeprofil</h2>
        <div>
          <div className="stat">
            <span>Kom ihåg direkt efter övning</span>
            <strong>{percent(recallIn(data.attempts, 'learn'))}</strong>
          </div>
          <div className="stat">
            <span>Kom ihåg efter minst en vecka</span>
            <strong>{percent(delayedRecall(data.attempts, data.reviews, 7))}</strong>
          </div>
          <div className="stat">
            <span>Gissning jämfört med utfall</span>
            <strong>
              {bias === null ? '–' : bias > 0.5 ? 'Gissar för högt' : bias < -0.5 ? 'Gissar för lågt' : 'Träffsäker'}
            </strong>
          </div>
          <div className="stat">
            <span>Ledtrådar per repetition</span>
            <strong>{hints === null ? '–' : hints.toFixed(1)}</strong>
          </div>
          <div className="stat">
            <span>Genomförda pass</span>
            <strong>{data.sessionsCompleted}</strong>
          </div>
        </div>
        <p className="muted small" style={{ margin: 0 }}>
          Poäng, snabbhet och antal dagar i rad mäts inte – de säger inget om lärande. Nya knep känns ofta svåra först;
          titta på utvecklingen över veckor.
        </p>
      </section>

      <section className="card card--soft stack">
        <h2>Data</h2>
        <p className="small" style={{ margin: 0 }}>
          All data finns bara på den här enheten.
        </p>
        <Button
          icon="trash"
          onClick={() => {
            if (window.confirm('Radera allt barnet gjort i appen? Det går inte att ångra.')) actions.resetAll();
          }}
        >
          Radera all data
        </Button>
      </section>
    </Screen>
  );
}
