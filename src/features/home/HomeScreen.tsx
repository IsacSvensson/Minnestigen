import { useApp } from '../../app/AppState';
import { toDay } from '../../engine/dates';
import { dueToday } from '../../engine/scheduler';
import { ForestScene, LANTERNS } from '../../graphics/ForestScene';
import { Button, IconButton } from '../../ui/components';

export function HomeScreen({ onStart, onGrownUp }: { onStart: () => void; onGrownUp: () => void }) {
  const { data } = useApp();
  const due = dueToday(data.reviews, toDay(new Date())).length;
  const lit = Math.min(data.sessionsCompleted, LANTERNS.length);
  const returning = data.sessionsCompleted > 0;

  return (
    <div className="home">
      <div className="home__scene">
        <ForestScene litLanterns={lit} />
      </div>
      <div className="home__overlay">
        <header className="home__header">
          <div className="home__title">
            <h1>Hej {data.profile?.name}!</h1>
            <p>
              Mönsterskogen · {lit} av {LANTERNS.length} lyktor tända
            </p>
          </div>
          <IconButton icon="grown" label="För vuxna" onClick={onGrownUp} />
        </header>
        <footer className="home__footer">
          {due > 0 && (
            <span className="pill">
              {due} {due === 1 ? 'sak väntar' : 'saker väntar'} på att plockas fram
            </span>
          )}
          <Button variant="primary" big wide icon="leaf" onClick={onStart}>
            {returning ? 'Gå stigen igen' : 'Gå stigen'}
          </Button>
        </footer>
      </div>
    </div>
  );
}
