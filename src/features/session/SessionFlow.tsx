// One session: the engine plans the phases, this component walks through them and reports every
// result back to app state.

import { useRef, useState } from 'react';
import { useApp } from '../../app/AppState';
import { nextNewItems } from '../../app/learning';
import { NEW_CARDS_PER_SESSION } from '../../content/decks';
import { toDay } from '../../engine/dates';
import { longTermHeadline } from '../../engine/metrics';
import { stepById } from '../../engine/progression';
import { planSession } from '../../engine/session';
import type { Attempt, AttemptContext, MemoryItem } from '../../engine/types';
import { Screen, IconButton } from '../../ui/components';
import { GuessAndTest } from '../modes/GuessAndTest';
import { LearnCards, MissionPhase, ReflectionPhase, Warmup, type ItemResult } from './phases';

export function SessionFlow({ onExit }: { onExit: () => void }) {
  const { data, actions } = useApp();
  // The step is fixed for the whole session, even if completing it moves the child on.
  const [step] = useState(() => data.profile!.currentStep);

  // Plan once when the session starts; later state changes must not reshuffle it.
  const [sessionId] = useState(() => crypto.randomUUID());
  const [plan] = useState(() => planSession(step, data.reviews, toDay(new Date())));
  const [newItems] = useState(() =>
    nextNewItems(data.customDecks, new Set(data.items.map((i) => i.id)), NEW_CARDS_PER_SESSION, new Date().toISOString()),
  );
  const [index, setIndex] = useState(0);
  const sessionAttempts = useRef<Attempt[]>([]);

  const phase = plan[index]!;
  const next = () => setIndex((i) => Math.min(i + 1, plan.length - 1));
  const itemsById = new Map(data.items.map((i) => [i.id, i]));

  const record = (result: ItemResult, context: AttemptContext) => {
    const attempt: Omit<Attempt, 'id' | 'at'> =
      result.kind === 'card'
        ? { itemId: result.item.id, context, technique: result.item.technique, hint: result.card.hint, correct: result.card.correct }
        : {
            itemId: result.item.id,
            context,
            technique: result.item.technique,
            hint: 'none',
            correct: result.recall.recalled === result.recall.total,
            score: result.recall,
          };
    sessionAttempts.current.push({ ...attempt, id: '', at: new Date().toISOString() });
    actions.recordAttempt(attempt);
  };

  let content;
  switch (phase.kind) {
    case 'warmup': {
      const items = phase.itemIds.map((id) => itemsById.get(id)).filter((i): i is MemoryItem => !!i);
      content = <Warmup items={items} onResult={(r) => record(r, 'review')} onDone={next} />;
      break;
    }
    case 'tool':
      if (phase.mode === 'guessAndTest') {
        content = (
          <GuessAndTest
            onDone={(result) => {
              const item: MemoryItem = {
                id: `bilder-${sessionId}`,
                deckId: 'gissa-och-prova',
                technique: 'metamemory',
                content: { kind: 'pictureSet', pictureIds: result.pictureIds },
                createdAt: new Date().toISOString(),
              };
              actions.learn([item]);
              record({ item, kind: 'pictureSet', recall: result.recall }, 'learn');
              actions.recordCalibration({
                itemId: item.id,
                predicted: result.predicted,
                actual: result.recall.recalled,
                total: result.recall.total,
              });
              actions.recordStrategyInsight(result.saysStrategyHelps);
              next();
            }}
          />
        );
      } else {
        content = (
          <LearnCards
            items={newItems}
            onResult={(r) => record(r, 'learn')}
            onDone={() => {
              actions.learn(newItems);
              next();
            }}
          />
        );
      }
      break;
    case 'reflection':
      content = (
        <ReflectionPhase
          onDone={(r) => {
            actions.recordReflection({ ...r, sessionId });
            actions.completeSession(step);
            next();
          }}
        />
      );
      break;
    case 'mission':
      content = (
        <MissionPhase text={phase.text} headline={longTermHeadline(sessionAttempts.current, data.reviews)} onDone={onExit} />
      );
      break;
  }

  return (
    <Screen
      title={`Steg ${step} · ${stepById(step).name}`}
      right={phase.kind === 'mission' ? undefined : <IconButton icon="home" label="Till skogen" onClick={onExit} />}
    >
      {content}
    </Screen>
  );
}
