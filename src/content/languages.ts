// Languages a school list can be in, for read-aloud and for the `lang` attribute.

import type { LanguageCode } from '../engine/types';

interface Language {
  name: string;
  /** Voice and markup tags, most wanted first. Swedish schools teach British English first. */
  tags: readonly string[];
}

export const LANGUAGES: Record<LanguageCode, Language> = {
  sv: { name: 'svenska', tags: ['sv-SE'] },
  en: { name: 'engelska', tags: ['en-GB', 'en-US'] },
  de: { name: 'tyska', tags: ['de-DE'] },
  fr: { name: 'franska', tags: ['fr-FR'] },
  es: { name: 'spanska', tags: ['es-ES'] },
};

export const LANGUAGE_CODES = Object.keys(LANGUAGES) as LanguageCode[];

/** The tag for markup, e.g. `lang="en-GB"`. */
export function langTag(code: LanguageCode | undefined): string {
  return LANGUAGES[code ?? 'sv'].tags[0]!;
}
