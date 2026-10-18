import './styles.css';
import { AppState } from '../app/state';
import { createStore, requestPersistence } from '../storage';
import type { AppContext } from './app';
import { registerServiceWorker } from './pwa';
import { showHome } from './screens/home';
import { showSetup } from './screens/setup';
import { hasSwedishVoice } from './speech';

async function start(): Promise<void> {
  const root = document.getElementById('app');
  if (!root) return;
  void registerServiceWorker();

  const { store, kind } = await createStore();
  const [data, persist] = await Promise.all([store.load(), requestPersistence()]);
  const ctx: AppContext = { root, state: new AppState(store, data), storageKind: kind, persist, canSpeak: false };
  // Voices load late in some browsers; screens opened after this get read-aloud buttons.
  void hasSwedishVoice().then((yes) => {
    ctx.canSpeak = yes;
  });

  if (!data.profile || !data.guardianConsentAt) showSetup(ctx);
  else showHome(ctx);
}

void start();
