import { SvelteMap } from 'svelte/reactivity';

export function signal<T>(value: T): { get: () => T; set: (newValue: T) => void } {
  let variable = $state(value);

  if (value !== undefined) {
    return {
      get() {
        return variable;
      },
      set(newValue: T | undefined) {
        variable = newValue ?? value;
      }
    };
  }
  return {
    get() {
      return variable;
    },
    set(newValue: T) {
      variable = newValue;
    }
  };
}

export function derivedSignal<T>(clojure: () => T): { get: () => T } {
  let variable = $derived(clojure());
  return {
    get() {
      return variable;
    }
  };
}

export class ReactiveMap<K, V> extends SvelteMap<K, V> {
  constructor(entries?: [K, V][]) {
    let e = $state(entries);
    super(e);
  }
  set(key: K, value: V) {
    let v = $state(value);
    super.set(key, v);
    return this;
  }
}
