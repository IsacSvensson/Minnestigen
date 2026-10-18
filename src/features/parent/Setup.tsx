// First run, filled in by a guardian: consent and the child's name and age (docs/06).

import { useState } from 'react';
import { useApp } from '../../app/AppState';
import { Owl } from '../../graphics/Owl';
import { Button, Screen } from '../../ui/components';

export function Setup() {
  const { actions } = useApp();
  const [name, setName] = useState('');
  const [age, setAge] = useState(7);
  const [consent, setConsent] = useState(false);
  const valid = name.trim().length > 0 && consent;

  return (
    <Screen>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Owl size={96} />
        <div>
          <h1 style={{ marginBottom: 4 }}>Minnesstigen</h1>
          <p className="muted" style={{ margin: 0 }}>
            För vuxna: fyll i tillsammans med barnet.
          </p>
        </div>
      </div>
      <div className="card stack">
        <label className="field">
          Barnets namn eller smeknamn
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" maxLength={24} />
        </label>
        <label className="field">
          Ålder
          <select value={age} onChange={(e) => setAge(Number(e.target.value))}>
            {[6, 7, 8, 9, 10, 11, 12].map((a) => (
              <option key={a} value={a}>
                {a} år
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="card card--soft stack small">
        <h3>Så hanteras data</h3>
        <p style={{ margin: 0 }}>
          Allt barnet gör sparas bara på den här enheten. Inget skickas till någon server, det finns ingen reklam, inga
          köp och inga sociala funktioner. Du kan radera allt i vuxenläget.
        </p>
        <label className="check">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>Jag är vårdnadshavare och godkänner att barnet använder appen.</span>
        </label>
      </div>
      <Button variant="primary" big wide disabled={!valid} onClick={() => actions.setupChild(name.trim(), age)}>
        Börja
      </Button>
    </Screen>
  );
}
