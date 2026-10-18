// Vuxenläget: child profile, Skolkopplingen (school lists), the learning profile, and data controls.

import * as act from '../../app/actions';
import { parseCardLines } from '../../app/learning';
import { calibrationBias, delayedRecall, meanHintSteps, recallIn, type Ratio } from '../../engine/metrics';
import { STEPS } from '../../engine/progression';
import type { LanguageCode, StepId } from '../../engine/types';
import { LANGUAGE_CODES, LANGUAGES } from '../../content/languages';
import { show, type AppContext } from '../app';
import { fill, h } from '../dom';
import { APP_BUILD } from '../pwa';
import { button, iconButton, screen } from '../ui';
import { showHome } from './home';
import { showSetup } from './setup';

/** Steps with a playable game mode in this build. */
const PLAYABLE_STEPS: StepId[] = [0, 1];

const percent = (r: Ratio) => (r.total === 0 ? '–' : `${Math.round((r.recalled / r.total) * 100)} % (${r.recalled}/${r.total})`);

/** " · svenska → engelska", or nothing for an all-Swedish list. */
function deckLanguages(prompt: LanguageCode | undefined, answer: LanguageCode | undefined): string {
  if (!prompt && !answer) return '';
  return ` · ${LANGUAGES[prompt ?? 'sv'].name} → ${LANGUAGES[answer ?? 'sv'].name}`;
}

function stat(label: string, value: string): HTMLElement {
  return h('div', { class: 'stat' }, h('span', null, label), h('strong', null, value));
}

export function showParent(ctx: AppContext): void {
  const { state } = ctx;
  const { view, body } = screen({ title: 'Vuxenläge', back: () => showHome(ctx) });

  const render = () => {
    const data = state.data;
    const profile = data.profile!;
    const step = STEPS[profile.currentStep]!;

    const name = h('input', { id: 'parent-name', value: profile.name, maxlength: '24' });
    name.addEventListener('change', () => state.apply(act.updateChild({ name: name.value.trim() || profile.name })));
    const stepSelect = h(
      'select',
      { id: 'parent-step' },
      PLAYABLE_STEPS.map((id) => h('option', { value: String(id), selected: id === profile.currentStep }, `Steg ${id} – ${STEPS[id]!.name}`)),
    );
    stepSelect.addEventListener('change', () => {
      state.apply(act.updateChild({ currentStep: Number(stepSelect.value) as StepId }));
      render();
    });

    const deckTitle = h('input', { id: 'deck-title', placeholder: 'Veckans glosor v. 43' });
    const deckLines = h('textarea', { id: 'deck-cards', placeholder: 'hund = dog\nkatt = cat\n7 · 8 = 56' });
    const languageSelect = (id: string) =>
      h('select', { id }, LANGUAGE_CODES.map((code) => h('option', { value: code }, LANGUAGES[code].name)));
    const promptLang = languageSelect('deck-prompt-lang');
    const answerLang = languageSelect('deck-answer-lang');
    const addButton = button('Lägg till lista', {
      variant: 'forest',
      icon: 'plus',
      disabled: true,
      onClick: () => {
        const language = (select: HTMLSelectElement) => (select.value === 'sv' ? undefined : (select.value as LanguageCode));
        state.apply(
          act.addDeck({
            title: deckTitle.value.trim(),
            cards: parseCardLines(deckLines.value),
            promptLang: language(promptLang),
            answerLang: language(answerLang),
          }),
        );
        render();
      },
    });
    const updateAdd = () => {
      const count = parseCardLines(deckLines.value).length;
      addButton.disabled = !deckTitle.value.trim() || count === 0;
      addButton.lastChild!.textContent = count > 0 ? `Lägg till ${count} kort` : 'Lägg till lista';
    };
    deckTitle.addEventListener('input', updateAdd);
    deckLines.addEventListener('input', updateAdd);

    const bias = calibrationBias(data.calibrations);
    const hints = meanHintSteps(data.attempts.filter((a) => a.context === 'review'));

    fill(
      body,
      h(
        'section',
        { class: 'card stack' },
        h('h2', null, 'Barnet'),
        h('label', { class: 'field', for: 'parent-name' }, 'Namn', name),
        h('label', { class: 'field', for: 'parent-step' }, 'Steg på stigen', stepSelect),
        h('p', { class: 'muted small' }, `${step.goal} Går vidare när: ${step.advanceWhen}`),
      ),
      h(
        'section',
        { class: 'card stack' },
        h('h2', null, 'Skolkopplingen'),
        h('p', { class: 'small muted' }, 'Lägg in veckans glosor, tabeller eller begrepp. En rad per kort: ', h('code', null, 'fråga = svar'), '. Skolans listor kommer före appens egna.'),
        h('label', { class: 'field', for: 'deck-title' }, 'Listans namn', deckTitle),
        h('label', { class: 'field', for: 'deck-cards' }, 'Kort', deckLines),
        h(
          'div',
          { class: 'field-row' },
          h('label', { class: 'field', for: 'deck-prompt-lang' }, 'Frågorna är på', promptLang),
          h('label', { class: 'field', for: 'deck-answer-lang' }, 'Svaren är på', answerLang),
        ),
        h('p', { class: 'muted small' }, 'Språket styr uppläsningen. Finns ingen röst för språket på enheten läses orden inte upp.'),
        addButton,
        data.customDecks.map((deck) =>
          h(
            'div',
            { class: 'stat stat--center' },
            h('span', null, deck.title, h('span', { class: 'muted' }, ` · ${deck.cards.length} kort${deckLanguages(deck.promptLang, deck.answerLang)}`)),
            iconButton('trash', `Ta bort ${deck.title}`, () => {
              state.apply(act.removeDeck(deck.id));
              render();
            }),
          ),
        ),
      ),
      h(
        'section',
        { class: 'card stack' },
        h('h2', null, 'Lärandeprofil'),
        h(
          'div',
          null,
          stat('Kom ihåg direkt efter övning', percent(recallIn(data.attempts, 'learn'))),
          stat('Kom ihåg efter minst en vecka', percent(delayedRecall(data.attempts, data.reviews, 7))),
          stat('Gissning jämfört med utfall', bias === null ? '–' : bias > 0.5 ? 'Gissar för högt' : bias < -0.5 ? 'Gissar för lågt' : 'Träffsäker'),
          stat('Ledtrådar per repetition', hints === null ? '–' : hints.toFixed(1)),
          stat('Genomförda pass', String(data.sessionsCompleted)),
        ),
        h(
          'p',
          { class: 'muted small' },
          'Poäng, snabbhet och antal dagar i rad mäts inte – de säger inget om lärande. Nya knep känns ofta svåra först; titta på utvecklingen över veckor.',
        ),
      ),
      h(
        'section',
        { class: 'card card--soft stack' },
        h('h2', null, 'Data'),
        h(
          'p',
          { class: 'small' },
          ctx.storageKind === 'memory'
            ? 'Den här webbläsaren tillåter inte lagring. Inget sparas när sidan stängs.'
            : `All data finns bara på den här enheten.${ctx.persist === 'persisted' ? ' Webbläsaren har lovat att inte rensa den.' : ' Installera appen på hemskärmen så rensas den inte lika lätt.'}`,
        ),
        button('Radera all data', {
          icon: 'trash',
          onClick: () => {
            if (!window.confirm('Radera allt barnet gjort i appen? Det går inte att ångra.')) return;
            state.apply(act.resetAll());
            showSetup(ctx);
          },
        }),
        h('p', { class: 'muted small' }, `Version ${APP_BUILD}`),
      ),
    );
  };

  render();
  show(ctx, view);
}
