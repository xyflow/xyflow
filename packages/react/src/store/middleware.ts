import { useDebugValue, useSyncExternalStore } from 'react';
import type { StateCreator, StoreApi } from 'zustand';

import type { ReactFlowState } from '../types';

type Selector<T, U> = (state: T) => U;
type EqualityFn<U> = (previous: U, next: U) => boolean;
type TrackedSubscription<U> = [
  subscribe: (listener: () => void) => () => void,
  getSnapshot: () => U,
  getInitialSnapshot: () => U,
];
type SubscribeTracked<T> = <U>(selector: Selector<T, U>, equalityFn?: EqualityFn<U>) => TrackedSubscription<U>;
type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

const identity = <T>(arg: T): T => arg;

export function useStoreTracked<S extends TrackedStoreApi<unknown>>(api: S): ExtractState<S>;
export function useStoreTracked<S extends TrackedStoreApi<unknown>, U>(
  api: S,
  selector: Selector<ExtractState<S>, U>,
  equalityFn?: EqualityFn<U>
): U;
export function useStoreTracked<TState, StateSlice>(
  api: TrackedStoreApi<TState>,
  selector: Selector<TState, StateSlice> = identity as any,
  equalityFn: EqualityFn<StateSlice> = Object.is
) {
  const [subscribe, getSnapshot, getInitialSnapshot] = api.subscribeTracked(selector, equalityFn);
  const slice = useSyncExternalStore(subscribe, getSnapshot, getInitialSnapshot);

  useDebugValue(slice);
  return slice;
}

export type TrackedStoreApi<T> = StoreApi<T> & {
  subscribeTracked: SubscribeTracked<T>;
};

declare module 'zustand/vanilla' {
  interface StoreMutators<S, A> {
    'xyflow/tracked': S & {
      subscribeTracked: SubscribeTracked<ExtractState<S>>;
    };
  }
}

type Snapshot<U> = { value: U; failed: false } | { error: unknown; failed: true };

export const middleware =
  (
    initializer: StateCreator<ReactFlowState, [['xyflow/tracked', never]]>
  ): StateCreator<ReactFlowState, [], [['xyflow/tracked', never]]> =>
  (set, get, store) => {
    const trackedStore = store as TrackedStoreApi<ReactFlowState>;
    const trackedProperties = new Map<PropertyKey, Set<() => void>>();
    // Unmounted selectors are held weakly; only active subscriptions enter the property map.
    const selectors = new WeakMap<
      Selector<ReactFlowState, unknown>,
      WeakMap<EqualityFn<never>, TrackedSubscription<unknown>>
    >();

    trackedStore.subscribeTracked = <U>(
      selector: Selector<ReactFlowState, U>,
      equalityFn: EqualityFn<U> = Object.is
    ): TrackedSubscription<U> => {
      let subscriptions = selectors.get(selector);
      const existing = subscriptions?.get(equalityFn);
      if (existing) {
        return existing as TrackedSubscription<U>;
      }
      if (!subscriptions) {
        subscriptions = new WeakMap();
        selectors.set(selector, subscriptions);
      }

      const listeners = new Set<() => void>();
      let dependencies = new Set<PropertyKey>();
      let snapshotState: ReactFlowState | undefined;
      let snapshot: Snapshot<U> | undefined;
      let initialSnapshot: Snapshot<U> | undefined;

      const evaluate = (state: ReactFlowState, reads: Set<PropertyKey>): Snapshot<U> => {
        const track = (property: PropertyKey) => {
          if (typeof Reflect.get(state, property) !== 'function') {
            reads.add(property);
          }
        };
        const proxy = new Proxy(state, {
          get(target, property) {
            track(property);
            return Reflect.get(target, property);
          },
          has(target, property) {
            track(property);
            return Reflect.has(target, property);
          },
          ownKeys(target) {
            const properties = Reflect.ownKeys(target);
            for (const property of properties) {
              track(property);
            }
            return properties;
          },
        });

        try {
          const value = selector(proxy);
          // Whole-state selectors must observe every data property and return the actual state.
          if (value === proxy) {
            for (const property of Reflect.ownKeys(state)) {
              track(property);
            }
            return { value: state as U, failed: false };
          }
          return { value, failed: false };
        } catch (error) {
          return { error, failed: true };
        }
      };

      const attach = (property: PropertyKey) => {
        let subscribers = trackedProperties.get(property);
        if (!subscribers) {
          subscribers = new Set();
          trackedProperties.set(property, subscribers);
        }
        subscribers.add(update);
      };

      const refresh = () => {
        const state = get();
        if (snapshot && snapshotState === state) {
          return;
        }
        if (
          snapshot &&
          snapshotState &&
          [...dependencies].every((property) =>
            Object.is(Reflect.get(snapshotState!, property), Reflect.get(state, property))
          )
        ) {
          snapshotState = state;
          return;
        }

        const nextDependencies = new Set<PropertyKey>();
        const nextSnapshot = evaluate(state, nextDependencies);
        if (!snapshot || snapshot.failed || nextSnapshot.failed || !equalityFn(snapshot.value, nextSnapshot.value)) {
          snapshot = nextSnapshot;
        }
        snapshotState = state;

        if (listeners.size) {
          for (const property of dependencies) {
            if (!nextDependencies.has(property)) {
              trackedProperties.get(property)?.delete(update);
            }
          }
          for (const property of nextDependencies) {
            if (!dependencies.has(property)) {
              attach(property);
            }
          }
        }
        dependencies = nextDependencies;
      };

      const update = () => {
        const previous = snapshot;
        refresh();
        if (previous !== snapshot) {
          for (const listener of [...listeners]) {
            listener();
          }
        }
      };

      const read = (result: Snapshot<U>) => {
        if (result.failed) {
          throw result.error;
        }
        return result.value;
      };

      const subscription: TrackedSubscription<U> = [
        (listener) => {
          // Refresh before attaching to cover updates between render and subscription.
          refresh();
          const callback = () => listener();
          listeners.add(callback);
          if (listeners.size === 1) {
            for (const property of dependencies) {
              attach(property);
            }
          }
          return () => {
            listeners.delete(callback);
            if (!listeners.size) {
              for (const property of dependencies) {
                trackedProperties.get(property)?.delete(update);
              }
            }
          };
        },
        () => {
          refresh();
          return read(snapshot!);
        },
        () => {
          initialSnapshot ??= evaluate(store.getInitialState(), new Set());
          return read(initialSnapshot);
        },
      ];
      subscriptions.set(equalityFn, subscription);
      return subscription;
    };

    const initialState = initializer(set, get, trackedStore);
    for (const [property, value] of Object.entries(initialState)) {
      if (typeof value !== 'function') {
        trackedProperties.set(property, new Set());
      }
    }

    store.subscribe((state, previousState) => {
      const affected = new Set<() => void>();
      for (const [property, subscribers] of trackedProperties) {
        if (!Object.is(Reflect.get(state, property), Reflect.get(previousState, property))) {
          for (const subscriber of subscribers) {
            affected.add(subscriber);
          }
        }
      }
      for (const subscriber of affected) {
        subscriber();
      }
    });

    return initialState;
  };
