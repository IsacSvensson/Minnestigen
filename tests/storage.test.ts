import 'fake-indexeddb/auto';
import { describe, expect, it } from 'vitest';
import { setupChild } from '../src/app/actions';
import { AppState } from '../src/app/state';
import { emptyData, IndexedDbStore, MemoryStore, normalize } from '../src/storage';

describe('storage', () => {
  it('keeps the document across opening the database again', async () => {
    const name = `test-${crypto.randomUUID()}`;
    const first = await IndexedDbStore.open(name);
    expect(await first.load()).toEqual(emptyData());
    const state = new AppState(first, await first.load());
    state.apply(setupChild('Alva', 8, new Date()));
    await state.flushed();
    first.close();

    const second = await IndexedDbStore.open(name);
    expect((await second.load()).profile?.name).toBe('Alva');
    await second.clear();
    expect(await second.load()).toEqual(emptyData());
    second.close();
  });

  it('falls back to memory', async () => {
    const store = new MemoryStore();
    await store.save(setupChild('Bo', 6, new Date())(emptyData()));
    expect((await store.load()).profile?.name).toBe('Bo');
  });

  it('fills in fields missing from older documents and drops unknown versions', () => {
    const { customDecks: _, ...old } = emptyData();
    expect(normalize(old).customDecks).toEqual([]);
    expect(normalize({ version: 99 })).toEqual(emptyData());
    expect(normalize(null)).toEqual(emptyData());
  });
});
