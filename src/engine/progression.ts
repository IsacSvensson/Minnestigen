// The eight steps of Minnesstigen (docs/03-metod-minnesstigen.md, D2).
// Ages are starting points for typically developing children, not limits. All advance criteria
// are proposals (N4) to be calibrated in the pilot.

import type { StepId, Technique } from './types';

export type GameMode =
  | 'guessAndTest' // Gissa och pröva
  | 'hideAndSay' // Göm och säg
  | 'sortingLab' // Sorteringslabbet
  | 'pictureMachine' // Bildmaskinen
  | 'storyTrain' // Berättelsetåget
  | 'memoryPalace' // Mitt minnespalats
  | 'wordWorkshop' // Ordverkstaden
  | 'toolbox' // Verktygslådan
  | 'codeBreaker'; // Kodknäckaren

export interface StepDefinition {
  id: StepId;
  name: string;
  fromAge: number;
  goal: string;
  technique: Technique;
  modes: GameMode[];
  /** Vardagsuppdrag suggested at the end of a session in this step. */
  everydayMission: string;
  advanceWhen: string;
  /** Planned release (docs/PLAN.md). Steps beyond version 1 are not playable yet. */
  release: 1 | 2;
  optional?: boolean;
}

export const STEPS: readonly StepDefinition[] = [
  {
    id: 0,
    name: 'Minnesupptäckaren',
    fromAge: 6,
    goal: 'Upptäcka att minnas är något man gör, och att man kan bedöma sitt eget minne.',
    technique: 'metamemory',
    modes: ['guessAndTest'],
    everydayMission:
      'Titta på frukostbordet en stund. Gissa hur många saker du kommer ihåg – blunda och kolla sen!',
    advanceWhen:
      'Två genomförda rundor och barnet kan säga att det går att göra något för att minnas bättre.',
    release: 1,
  },
  {
    id: 1,
    name: 'Plocka fram',
    fromAge: 6,
    goal: 'Självtest blir barnets första och viktigaste verktyg.',
    technique: 'retrieval',
    modes: ['hideAndSay'],
    everydayMission: 'Be en vuxen förhöra dig på något från skolan. Säg svaret innan du tittar!',
    advanceWhen:
      'Startar självtest utan uppmaning i tre pass, och fördröjd återkallning efter en vecka är högre än vid första testet.',
    release: 1,
  },
  {
    id: 2,
    name: 'Sortera och gruppera',
    fromAge: 6,
    goal: 'Ordna material i grupper och bitar innan man memorerar.',
    technique: 'grouping',
    modes: ['sortingLab'],
    everydayMission: 'Dela upp inköpslistan i grupper – frukt, mjölk, bröd – och se hur mycket du minns.',
    advanceWhen:
      'Grupperar spontant på ny lista och minns mer än utan gruppering. Annars: fler exempel och en förklaring.',
    release: 1,
  },
  {
    id: 3,
    name: 'Bilder och berättelser',
    fromAge: 6,
    goal: 'Göra saker till levande, roliga bilder och knyta ihop dem.',
    technique: 'imagery',
    modes: ['pictureMachine', 'storyTrain'],
    everydayMission:
      'Gör gympapåsen till en berättelse. När du ställer skorna i hallen – tänk på påsen!',
    advanceWhen: 'Egna bilder i minst hälften av försöken och fördröjt resultat i nivå med färdiga bilder.',
    release: 1,
  },
  {
    id: 4,
    name: 'Mitt minnespalats',
    fromAge: 8,
    goal: 'Bygga en fast rutt hemma och använda den för ordnade listor.',
    technique: 'loci',
    modes: ['memoryPalace'],
    everydayMission: 'Placera planeterna längs din rutt hemma och gå igenom dem i morgon.',
    advanceWhen: 'Minst åtta av tio rätt i ordning efter en dag, på två olika listor.',
    release: 1,
  },
  {
    id: 5,
    name: 'Ordverkstaden',
    fromAge: 8,
    goal: 'Lära glosor, namn och numrerade listor med nyckelord och knaggar.',
    technique: 'keyword',
    modes: ['wordWorkshop'],
    everydayMission: 'Testa veckans glosor utan bilder – minns du dem ändå?',
    advanceWhen: 'Fördröjt resultat efter två veckor minst lika bra som med bara självtest.',
    release: 2,
  },
  {
    id: 6,
    name: 'Välj verktyg',
    fromAge: 9,
    goal: 'Välja rätt knep för uppgiften och kunna förklara varför.',
    technique: 'retrieval',
    modes: ['toolbox'],
    everydayMission: 'Välj ett knep för något du behöver minnas i morgon. När ska du använda det?',
    advanceWhen: 'Passande val utan uppmaning i minst två av tre nya uppgifter.',
    release: 2,
  },
  {
    id: 7,
    name: 'Kodknäckaren',
    fromAge: 10,
    goal: 'Omvandla siffror till ord med en fast sifferkod.',
    technique: 'keyword',
    modes: ['codeBreaker'],
    everydayMission: 'Knäck koden till ett årtal från SO-boken.',
    advanceWhen: 'Frivilligt fördjupningsspår – inget annat bygger på det.',
    release: 2,
    optional: true,
  },
];

export function stepById(id: StepId): StepDefinition {
  const step = STEPS[id];
  if (!step) throw new Error(`Unknown step ${id}`);
  return step;
}

/**
 * Starting step. Everyone starts with the discovery step: metamemory predicts later strategy use
 * and the step is short. A placement test (E3) may move older children on quickly later.
 */
export function startStep(): StepId {
  return 0;
}

export interface StepZeroEvidence {
  completedRounds: number;
  /** The child said, in words or by picking, that you can do something to remember better. */
  saysStrategyHelps: boolean;
}

export function stepZeroComplete(evidence: StepZeroEvidence): boolean {
  return evidence.completedRounds >= 2 && evidence.saysStrategyHelps;
}
