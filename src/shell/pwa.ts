// Service worker registration and updates. Follows Mattedalen's rules: a new version is never
// swapped in during a session; it starts at the next app start, or from the update bar.

import { h } from './dom';

let waiting: ServiceWorker | null = null;
/** A session is on screen: never reload in the middle of it. */
let busy = false;
let reloadWhenFree = false;

/** Pause after the page has loaded before a waiting version is started (Chromium needs it). */
const SETTLE_MS = 1000;
/** How often an open app looks for a new version (besides at start and when it comes back to the front). */
const UPDATE_CHECK_MS = 30 * 60_000;

/** Build of the running app, e.g. "2026-10-18 · 8ba0bb2" (set by vite.config.ts). */
export const APP_BUILD: string = typeof __APP_BUILD__ === 'string' ? __APP_BUILD__ : 'utveckling';

/**
 * Registers the service worker (production builds only).
 *
 * A new version is downloaded in the background and then:
 * - taken into use right away if it was already waiting when the app started
 *   (an installed app is often never fully closed, so it would wait forever),
 * - otherwise offered with an update bar on every screen except during a session.
 */
export async function registerServiceWorker(): Promise<void> {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  let hadController = !!navigator.serviceWorker.controller;
  try {
    const reg = await navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // The first install takes control without a reload.
      if (!hadController && !waiting) {
        hadController = true;
        return;
      }
      if (busy) reloadWhenFree = true;
      else location.reload();
    });
    if (reg.waiting && hadController) {
      const worker = reg.waiting;
      await pageLoaded();
      await new Promise((resolve) => setTimeout(resolve, SETTLE_MS));
      if (!busy) {
        worker.postMessage('skipWaiting');
        return;
      }
    }
    const track = (worker: ServiceWorker | null) => {
      if (!worker) return;
      const check = () => {
        // Only an update (not the first install) needs the go-ahead.
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          waiting = worker;
          renderUpdateBar();
        }
      };
      check();
      worker.addEventListener('statechange', check);
    };
    track(reg.waiting);
    reg.addEventListener('updatefound', () => track(reg.installing));
    const lookForUpdate = () => void reg.update().catch(() => undefined);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') lookForUpdate();
    });
    window.addEventListener('online', lookForUpdate);
    setInterval(() => {
      if (document.visibilityState === 'visible') lookForUpdate();
    }, UPDATE_CHECK_MS);
  } catch {
    // Offline support is a bonus; the app still works online without it.
  }
}

function pageLoaded(): Promise<void> {
  if (document.readyState === 'complete') return Promise.resolve();
  return new Promise((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
}

/** Called for every new screen: sessions are busy, everything else may update. */
export function setScreenBusy(isBusy: boolean): void {
  busy = isBusy;
  if (!busy && reloadWhenFree) {
    location.reload();
    return;
  }
  renderUpdateBar();
}

function renderUpdateBar(): void {
  document.querySelector('.update-bar')?.remove();
  if (!waiting || busy) return;
  const bar = h(
    'div',
    { class: 'update-bar', role: 'status' },
    h('span', null, 'En ny version finns.'),
    h('button', { class: 'btn btn--forest', type: 'button', onclick: () => waiting?.postMessage('skipWaiting') }, 'Uppdatera'),
  );
  document.body.append(bar);
}
