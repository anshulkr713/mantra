import { get, set, del, keys } from 'idb-keyval';

/**
 * Creates a reactive state variable that auto-syncs with IndexedDB.
 * Uses Svelte 5 runes ($state) with manual persistence on writes.
 */
export function createPersistentState<T>(key: string, defaultValue: T) {
  let value = $state<T>(defaultValue);
  let loaded = $state(false);

  // Load from IndexedDB on creation
  if (typeof window !== 'undefined') {
    get(key).then((stored) => {
      if (stored !== undefined) {
        value = stored as T;
      }
      loaded = true;
    }).catch(() => {
      loaded = true;
    });
  } else {
    loaded = true;
  }

  return {
    get value() { return value; },
    set value(v: T) {
      value = v;
      // Persist to IndexedDB on every write — use $state.snapshot() to strip Svelte proxies
      if (typeof window !== 'undefined') {
        try {
          const plain = $state.snapshot(v);
          set(key, plain).catch(console.error);
        } catch {
          // Fallback for primitives
          set(key, v).catch(console.error);
        }
      }
    },
    get loaded() { return loaded; }
  };
}

/**
 * Creates a persistent state for array data with helper methods.
 */
export function createPersistentList<T>(key: string, defaultValue: T[] = []) {
  const state = createPersistentState<T[]>(key, defaultValue);

  return {
    get value() { return state.value; },
    set value(v: T[]) { state.value = v; },
    get loaded() { return state.loaded; },
    add(item: T) {
      state.value = [...state.value, item];
    },
    remove(predicate: (item: T) => boolean) {
      state.value = state.value.filter((item) => !predicate(item));
    },
    update(predicate: (item: T) => boolean, updater: (item: T) => T) {
      state.value = state.value.map((item) => predicate(item) ? updater(item) : item);
    }
  };
}

export { get, set, del, keys };
