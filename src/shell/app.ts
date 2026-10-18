import type { AppState } from '../app/state';
import type { PersistStatus } from '../storage';
import { setScreenBusy } from './pwa';

export interface AppContext {
  root: HTMLElement;
  state: AppState;
  storageKind: 'indexeddb' | 'memory';
  persist: PersistStatus;
  /** A Swedish voice on the device exists; otherwise there are no read-aloud buttons. */
  canSpeak: boolean;
}

type Cleanup = () => void;

let current: Cleanup | undefined;

/**
 * Replaces the visible screen. A screen may return a cleanup function for global listeners.
 * Screens with the class `session` are busy: an app update never reloads in the middle of them.
 */
export function show(ctx: AppContext, view: HTMLElement, cleanup?: Cleanup): void {
  current?.();
  current = cleanup;
  ctx.root.replaceChildren(view);
  setScreenBusy(view.classList.contains('session'));
  // Move focus to the new screen for keyboard and screen-reader users.
  const focusTarget = view.querySelector<HTMLElement>('[autofocus], h1');
  if (focusTarget) {
    if (!focusTarget.hasAttribute('tabindex') && focusTarget.tagName === 'H1') focusTarget.tabIndex = -1;
    focusTarget.focus({ preventScroll: true });
  }
  window.scrollTo(0, 0);
}
