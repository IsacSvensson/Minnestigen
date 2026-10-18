import type { AppData, Store } from '../storage';
import type { Action } from './actions';

/**
 * Holds the app document in memory and saves every change. Saves run one after another, so a
 * slow write can never overwrite a newer one.
 */
export class AppState {
  private saving: Promise<void> = Promise.resolve();

  constructor(
    private readonly store: Store,
    public data: AppData,
  ) {}

  apply(action: Action): AppData {
    this.data = action(this.data);
    const snapshot = this.data;
    this.saving = this.saving.then(() => this.store.save(snapshot)).catch(() => undefined);
    return this.data;
  }

  /** Resolves when everything applied so far is written. */
  flushed(): Promise<void> {
    return this.saving;
  }
}
