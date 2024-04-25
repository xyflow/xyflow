// export function createSignal<T, N extends string>(name: N, value: T): { [K in N]: T } {
//   let variable = $state(value);
//   return {
//     get [name]() {
//       return variable;
//     },
//     set [name](newValue: T) {
//       variable = newValue;
//     }
//   } as { [K in N]: T };
// }

import { get, type Writable } from 'svelte/store';

// export function createDerivedSignal<T, N extends string>(name: N, value: () => T): { [K in N]: T } {
//   let variable = $state(value);
//   return {
//     get [name]() {
//       return variable;
//     }
//   } as { [K in N]: T };
// }

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

export function derivedSignalWritable<T, K>(
  clojure: (store: K) => T,
  store: Writable<K>,
  updater?: Writable<any>
): { get: () => T } {
  let storeState = $state(get(store));
  let forceUpdate = $state(0);
  let variable = $derived.by(() => {
    forceUpdate;
    return clojure(storeState);
  });

  store.subscribe((newValue) => {
    storeState = newValue;
  });

  if (updater) {
    updater.subscribe(() => {
      forceUpdate += 1;
      storeState = get(store);
    });
  }

  return {
    get() {
      return variable;
    }
  };
}
