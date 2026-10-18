// Uppläsning via the browser's built-in speech synthesis. Runs on the device; no audio is sent
// anywhere. Recorded voice lines can replace this later (docs/PLAN.md).

export function speak(text: string): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'sv-SE';
  utterance.rate = 0.9;
  const swedish = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith('sv'));
  if (swedish) utterance.voice = swedish;
  synth.speak(utterance);
}
