/**
 * Optional read-aloud (Web Speech API). Only voices on the device are used:
 * some browsers (Chrome) also offer network voices (`localService === false`)
 * that send the text to a server, and nothing may leave the device.
 *
 * Every part is read in its own language: a Swedish sentence with a Swedish
 * voice, an English word (glosa) with an English one. A part with no local
 * voice in its language is left out rather than read by another language's
 * voice, which would teach the child the wrong pronunciation.
 */

import { LANGUAGES } from '../content/languages';
import type { LanguageCode } from '../engine/types';

/** A piece of text in a known language. A plain string is Swedish. */
export interface SpokenPart {
  text: string;
  lang: LanguageCode;
}
export type Spoken = string | SpokenPart;

function synth(): SpeechSynthesis | undefined {
  return typeof speechSynthesis !== 'undefined' ? speechSynthesis : undefined;
}

export function speechSupported(): boolean {
  return synth() !== undefined && typeof SpeechSynthesisUtterance !== 'undefined';
}

/** A local voice for the language: the preferred tags in order, then any voice of the language. */
export function voiceFor(lang: LanguageCode, voices: readonly SpeechSynthesisVoice[] = synth()?.getVoices() ?? []): SpeechSynthesisVoice | undefined {
  const local = voices.filter((v) => v.localService === true);
  for (const tag of LANGUAGES[lang].tags) {
    const exact = local.find((v) => v.lang.replace('_', '-').toLowerCase() === tag.toLowerCase());
    if (exact) return exact;
  }
  return local.find((v) => v.lang.toLowerCase().startsWith(lang));
}

/** Voices load asynchronously in some browsers. True if a Swedish voice on the device exists. */
export async function hasSwedishVoice(): Promise<boolean> {
  const s = synth();
  if (!s) return false;
  if (voiceFor('sv')) return true;
  await new Promise<void>((resolve) => {
    const done = () => resolve();
    s.addEventListener('voiceschanged', done, { once: true });
    setTimeout(done, 1500);
  });
  return voiceFor('sv') !== undefined;
}

/** "6 · 7" → "6 gånger 7", as a child would say it. */
export function spokenText(text: string): string {
  return text
    .replace(/[×·]/g, ' gånger ')
    .replace(/÷/g, ' delat med ')
    .replace(/−/g, ' minus ')
    .replace(/\+/g, ' plus ')
    .replace(/=\s*\?/g, '')
    .replace(/=/g, ' är ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Chrome drops an utterance spoken right after `cancel()`: this long a pause first. */
export const CANCEL_GAP_MS = 80;
/** An utterance that has not started after this long is tried once more. */
export const START_WAIT_MS = 1200;
/** Some engines never fire `end`; the game never waits longer than this. */
const LONGEST_MS = 6000;

const pause = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Wakes an engine left paused (every browser has `resume`; a stand-in for one may not). */
function wake(s: SpeechSynthesis): void {
  if (typeof s.resume === 'function') s.resume();
}

/** Bumped by every new `speak`: an older sequence stops instead of talking over it. */
let generation = 0;

/**
 * Speaks the parts one after another, each with a voice on the device in its
 * own language; resolves when done. Parts without such a voice are skipped.
 * It never waits for voices to load: the read-aloud button is only shown when
 * `hasSwedishVoice()` said yes at start.
 *
 * Chrome on Android can get stuck: paused, or still "speaking" an earlier
 * utterance, so that new ones wait in silence until the phone is restarted.
 * So the engine is woken (`resume`) before each utterance, an earlier one is
 * cancelled with a short pause after it, and an utterance that has not
 * started after a moment is tried once more.
 */
export async function speak(spoken: Spoken | readonly Spoken[]): Promise<void> {
  const s = synth();
  if (!s || typeof SpeechSynthesisUtterance === 'undefined') return;
  const parts = (Array.isArray(spoken) ? spoken : [spoken]) as readonly Spoken[];
  const voiced = parts
    .map((p) => (typeof p === 'string' ? { text: p, lang: 'sv' as const } : p))
    .map((p) => ({ ...p, voice: voiceFor(p.lang) }))
    .filter((p): p is SpokenPart & { voice: SpeechSynthesisVoice } => p.voice !== undefined && p.text.trim() !== '');
  if (voiced.length === 0) return;
  const mine = ++generation;
  if (s.speaking || s.pending) {
    s.cancel();
    await pause(CANCEL_GAP_MS);
  }
  for (const part of voiced) {
    if (generation !== mine) return;
    await speakOne(s, part.lang === 'sv' ? spokenText(part.text) : part.text, part.voice);
  }
}

function speakOne(s: SpeechSynthesis, text: string, voice: SpeechSynthesisVoice): Promise<void> {
  wake(s);
  return new Promise((resolve) => {
    let started = false;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    const say = (again: boolean) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = voice.lang;
      u.voice = voice;
      u.rate = 0.9;
      u.onstart = () => {
        started = true;
      };
      u.onend = finish;
      u.onerror = finish;
      s.speak(u);
      if (again) return;
      setTimeout(() => {
        if (started || settled || s.speaking) return;
        // Not started: the engine was stuck. Clear it and try once more.
        s.cancel();
        setTimeout(() => {
          if (settled) return;
          wake(s);
          say(true);
        }, CANCEL_GAP_MS);
      }, START_WAIT_MS);
    };
    say(false);
    setTimeout(finish, LONGEST_MS);
  });
}

export function stopSpeaking(): void {
  synth()?.cancel();
}
