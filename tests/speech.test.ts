import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { speak, voiceFor } from '../src/shell/speech';

const voice = (name: string, lang: string, localService = true) => ({ name, lang, localService }) as SpeechSynthesisVoice;

const ALVA = voice('Alva', 'sv-SE');
const DANIEL = voice('Daniel', 'en-GB');
const SAMANTHA = voice('Samantha', 'en-US');
const NETWORK_EN = voice('Google US English', 'en-US', false);

class FakeUtterance {
  lang = '';
  voice: SpeechSynthesisVoice | null = null;
  rate = 1;
  onstart?: () => void;
  onend?: () => void;
  onerror?: () => void;
  constructor(public text: string) {}
}

let voices: SpeechSynthesisVoice[] = [];
let spoken: { text: string; voice: string; lang: string }[] = [];

beforeEach(() => {
  spoken = [];
  vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
  vi.stubGlobal('speechSynthesis', {
    speaking: false,
    pending: false,
    getVoices: () => voices,
    speak(u: FakeUtterance) {
      spoken.push({ text: u.text, voice: u.voice!.name, lang: u.lang });
      setTimeout(() => {
        u.onstart?.();
        u.onend?.();
      }, 0);
    },
    cancel() {},
    resume() {},
    addEventListener() {},
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('read-aloud', () => {
  it('reads each part in its own language: a Swedish sentence, then an English glosa', async () => {
    voices = [ALVA, DANIEL];
    await speak(['Titta och säg tyst för dig själv:', { text: 'äpple', lang: 'sv' }, { text: 'apple', lang: 'en' }]);
    expect(spoken).toEqual([
      { text: 'Titta och säg tyst för dig själv:', voice: 'Alva', lang: 'sv-SE' },
      { text: 'äpple', voice: 'Alva', lang: 'sv-SE' },
      { text: 'apple', voice: 'Daniel', lang: 'en-GB' },
    ]);
  });

  it('leaves an English word out rather than reading it with a Swedish voice', async () => {
    voices = [ALVA, NETWORK_EN];
    await speak(['Titta:', { text: 'apple', lang: 'en' }]);
    expect(spoken.map((s) => s.text)).toEqual(['Titta:']);
  });

  it('says math the Swedish way, but never rewrites other languages', async () => {
    voices = [ALVA, DANIEL];
    await speak([{ text: '6 · 7', lang: 'sv' }, { text: 'six + seven', lang: 'en' }]);
    expect(spoken.map((s) => s.text)).toEqual(['6 gånger 7', 'six + seven']);
  });

  it('prefers British English, accepts Android-style tags, and never picks a network voice', () => {
    expect(voiceFor('en', [SAMANTHA, DANIEL])).toBe(DANIEL);
    expect(voiceFor('en', [SAMANTHA])).toBe(SAMANTHA);
    expect(voiceFor('en', [voice('Android', 'en_GB')])?.name).toBe('Android');
    expect(voiceFor('en', [NETWORK_EN])).toBeUndefined();
    expect(voiceFor('de', [ALVA, DANIEL])).toBeUndefined();
  });

  it('stops an older reading when a new one starts', async () => {
    voices = [ALVA, DANIEL];
    const first = speak(['Ett', 'Två', 'Tre']);
    const second = speak('Nytt');
    await Promise.all([first, second]);
    expect(spoken.map((s) => s.text)).not.toContain('Tre');
    expect(spoken.map((s) => s.text)).toContain('Nytt');
  });

  it('says nothing without any voice for the language', async () => {
    voices = [];
    await speak('Hej');
    expect(spoken).toEqual([]);
  });
});
