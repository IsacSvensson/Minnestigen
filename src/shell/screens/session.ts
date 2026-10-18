// One session (docs/04-appkoncept.md, E1): the engine plans the phases, this screen walks through
// them and reports every result to the app state.

import * as act from '../../app/actions';
import { nextNewItems } from '../../app/learning';
import { NEW_CARDS_PER_SESSION } from '../../content/decks';
import { toDay } from '../../engine/dates';
import { longTermHeadline, type Ratio } from '../../engine/metrics';
import { stepById } from '../../engine/progression';
import { planSession } from '../../engine/session';
import type { Attempt, AttemptContext, MemoryItem, Reflection, StrategyChoice } from '../../engine/types';
import { owl } from '../../graphics/owl';
import { show, type AppContext } from '../app';
import { fill, h } from '../dom';
import { guessAndTest } from '../modes/guessAndTest';
import { hideAndSay, studyCard, type CardResult } from '../modes/hideAndSay';
import { pictureRecall, type RecallResult } from '../modes/pictureRecall';
import { button, guide, heading, screen } from '../ui';
import { showHome } from './home';

type ItemResult = { item: MemoryItem } & ({ kind: 'card'; card: CardResult } | { kind: 'pictureSet'; recall: RecallResult });

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

export function showSession(ctx: AppContext): void {
  const { state } = ctx;
  const startData = state.data;
  // The step is fixed for the whole session, even if completing it moves the child on.
  const step = startData.profile!.currentStep;
  const sessionId = crypto.randomUUID();
  const plan = planSession(step, startData.reviews, toDay(new Date()));
  const newItems = nextNewItems(startData.customDecks, new Set(startData.items.map((i) => i.id)), NEW_CARDS_PER_SESSION, new Date().toISOString());
  const sessionAttempts: Attempt[] = [];
  const goHome = () => showHome(ctx);

  const { view, body } = screen({ title: `Steg ${step} · ${stepById(step).name}`, home: goHome, session: true });
  show(ctx, view);

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
    const now = new Date();
    sessionAttempts.push({ ...attempt, id: '', at: now.toISOString() });
    state.apply(act.recordAttempt(attempt, now));
  };

  const runPhase = (index: number) => {
    const phase = plan[index];
    const next = () => runPhase(index + 1);
    if (!phase) return;
    switch (phase.kind) {
      case 'warmup': {
        const items = phase.itemIds.map((id) => startData.items.find((i) => i.id === id)).filter((i): i is MemoryItem => !!i);
        return warmup(items, (r) => record(r, 'review'), next);
      }
      case 'tool':
        return phase.mode === 'guessAndTest' ? stepZero(next) : learnCards(next);
      case 'reflection':
        return reflection((r) => {
          state.apply(act.recordReflection({ ...r, sessionId }, new Date()));
          state.apply(act.completeSession(step));
          next();
        });
      case 'mission':
        return mission(phase.text, longTermHeadline(sessionAttempts, state.data.reviews));
    }
  };

  /** Uppvärmning: plocka fram what the schedule says is due. */
  const warmup = (items: MemoryItem[], onResult: (r: ItemResult) => void, onDone: () => void) => {
    const run = (i: number) => {
      const item = items[i];
      if (!item) return onDone();
      const area = h('div', { class: 'flow' });
      fill(body, heading('Plocka fram', i, items.length), area);
      const after = () => run(i + 1);
      if (item.content.kind === 'card') {
        hideAndSay(ctx, area, item, (card) => {
          onResult({ item, kind: 'card', card });
          after();
        });
      } else {
        pictureRecall(ctx, area, item.content.pictureIds, 'Minns du bilderna från förra gången? Tryck på dem du kommer ihåg.', (recall) => {
          onResult({ item, kind: 'pictureSet', recall });
          after();
        });
      }
    };
    run(0);
  };

  /** Dagens verktyg, steg 0: Gissa och pröva. The picture set enters the schedule. */
  const stepZero = (onDone: () => void) =>
    guessAndTest(ctx, body, (result) => {
      const now = new Date();
      const item: MemoryItem = {
        id: `bilder-${sessionId}`,
        deckId: 'gissa-och-prova',
        technique: 'metamemory',
        content: { kind: 'pictureSet', pictureIds: result.pictureIds },
        createdAt: now.toISOString(),
      };
      state.apply(act.learn([item], now));
      record({ item, kind: 'pictureSet', recall: result.recall }, 'learn');
      state.apply(act.recordCalibration({ itemId: item.id, predicted: result.predicted, actual: result.recall.recalled, total: result.recall.total }, now));
      state.apply(act.recordStrategyInsight(result.saysStrategyHelps));
      onDone();
    });

  /** Dagens verktyg, steg 1: titta on all new cards, then göm–säg–kolla on each. */
  const learnCards = (onDone: () => void) => {
    if (newItems.length === 0) {
      return fill(
        body,
        h(
          'div',
          { class: 'screen__body screen__body--center' },
          owl('happy', 160),
          h('h2', null, 'Allt är redan inlärt!'),
          h('p', { class: 'muted' }, 'Be en vuxen lägga in nya ord i vuxenläget.'),
          button('Vidare', { variant: 'primary', big: true, onClick: onDone }),
        ),
      );
    }
    const study = (i: number) => {
      const item = newItems[i];
      if (!item) return recall(0);
      const area = h('div', { class: 'flow' });
      fill(body, heading('Titta', i, newItems.length), area);
      studyCard(ctx, area, item, () => study(i + 1));
    };
    const recall = (i: number) => {
      const item = newItems[i];
      if (!item) {
        state.apply(act.learn(newItems, new Date()));
        return onDone();
      }
      const area = h('div', { class: 'flow' });
      fill(body, heading('Göm och säg', i, newItems.length), area);
      hideAndSay(ctx, area, item, (card) => {
        record({ item, kind: 'card', card }, 'learn');
        recall(i + 1);
      });
    };
    study(0);
  };

  /** Reflektion: a question about the strategy, not about points. */
  const reflection = (onDone: (r: Pick<Reflection, 'strategy' | 'helped'>) => void) => {
    const helped = (strategy: StrategyChoice) =>
      fill(
        body,
        guide(ctx, 'thinking', 'Hjälpte det?'),
        h('div', { class: 'numbers numbers--2' }, HELPED.map((x) => button(x.label, { big: true, onClick: () => onDone({ strategy, helped: x.id }) }))),
      );
    fill(
      body,
      guide(ctx, 'thinking', 'Vilket knep använde du för att komma ihåg?'),
      h(
        'div',
        { class: 'choices' },
        STRATEGIES.map((x) =>
          button(x.label, {
            class: 'choice',
            onClick: () => (x.id === 'nothing' || x.id === 'dontKnow' ? onDone({ strategy: x.id, helped: 'dontKnow' }) : helped(x.id)),
          }),
        ),
      ),
    );
  };

  /** Avslut: long-term memory headline, the lantern, and a vardagsuppdrag. */
  const mission = (text: string, headline: Ratio | null) => {
    const { view: endView, body: endBody } = screen({ title: `Steg ${step} · ${stepById(step).name}` });
    endBody.classList.add('screen__body--center');
    fill(
      endBody,
      h('div', { class: 'pop' }, owl('cheer', 170)),
      h('h1', null, headline ? `Du kom ihåg ${headline.recalled} av ${headline.total} från förra veckan!` : 'I morgon kollar vi vad du minns!'),
      h('p', { class: 'muted' }, 'Du tände en ny lykta i Mönsterskogen.'),
      h('div', { class: 'card mission' }, h('h3', null, 'Vardagsuppdrag'), h('p', null, text)),
      button('Tillbaka till skogen', { variant: 'primary', big: true, wide: true, icon: 'home', onClick: goHome }),
    );
    show(ctx, endView);
  };

  runPhase(0);
}
