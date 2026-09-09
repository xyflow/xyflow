import { useDebugValue, useSyncExternalStore } from 'react';
import type { StateCreator, StoreApi } from 'zustand';

import type { ReactFlowState } from '../types';

export type TrackedState<T> = T extends {
  nodeLookup: ReadonlyMap<string, infer N>;
  edgeLookup: ReadonlyMap<string, infer E>;
}
  ? T & { getInternalNodeById: (id: string) => N | undefined; getEdgeById: (id: string) => E | undefined }
  : T;

type Selector<T, U> = (state: TrackedState<T>) => U;
type EqualityFn<U> = (previous: U, next: U) => boolean;
type TrackedSubscription<U> = [
  subscribe: (listener: () => void) => () => void,
  getSnapshot: () => U,
  getInitialSnapshot: () => U,
];
type SubscribeTracked<T> = <U>(selector: Selector<T, U>, equalityFn?: EqualityFn<U>) => TrackedSubscription<U>;
type ExtractState<S> = S extends { getState: () => infer T } ? T : never;

const identity = <T>(arg: T): T => arg;

// React Flow mutates lookup maps in place, including before set({}) updates.
const propertyChanged = (previous: ReactFlowState, next: ReactFlowState, property: PropertyKey) => {
  const previousValue: unknown = Reflect.get(previous, property);
  const nextValue: unknown = Reflect.get(next, property);
  return previousValue instanceof Map || nextValue instanceof Map || !Object.is(previousValue, nextValue);
};

type Dependencies = {
  properties: Set<PropertyKey>;
  nodes: Map<string, unknown>;
  edges: Map<string, unknown>;
};

// Most selectors read only ordinary properties. Allocate ID maps only when a helper is called.
const noLookupReads = new Map<string, unknown>();
const createDependencies = (): Dependencies => ({ properties: new Set(), nodes: noLookupReads, edges: noLookupReads });

const dependenciesChanged = (previous: ReactFlowState, next: ReactFlowState, dependencies: Dependencies) => {
  for (const property of dependencies.properties) {
    if (propertyChanged(previous, next, property)) {
      return true;
    }
  }
  for (const [id, value] of dependencies.nodes) {
    if (next.nodeLookup.get(id) !== value) {
      return true;
    }
  }
  for (const [id, value] of dependencies.edges) {
    if (next.edgeLookup.get(id) !== value) {
      return true;
    }
  }
  return false;
};

type Listeners<K> = Map<K, Set<() => void>>;

function attach<K>(index: Listeners<K>, key: K, listener: () => void) {
  let listeners = index.get(key);
  if (!listeners) {
    listeners = new Set();
    index.set(key, listeners);
  }
  listeners.add(listener);
}

function detach<K>(index: Listeners<K>, key: K, listener: () => void) {
  const listeners = index.get(key);
  listeners?.delete(listener);
  if (!listeners?.size) {
    index.delete(key);
  }
}

function reconcile<K>(
  index: Listeners<K>,
  previous: ReadonlySet<K> | ReadonlyMap<K, unknown>,
  next: ReadonlySet<K> | ReadonlyMap<K, unknown>,
  listener: () => void
) {
  if (previous === next) return;
  for (const key of previous.keys()) {
    if (!next.has(key)) detach(index, key, listener);
  }
  for (const key of next.keys()) {
    if (!previous.has(key)) attach(index, key, listener);
  }
}

function collect<K>(index: Listeners<K>, keys: Iterable<K>, affected: Set<() => void>) {
  for (const key of keys) {
    const listeners = index.get(key);
    if (listeners) {
      for (const listener of listeners) affected.add(listener);
    }
  }
}

export function useStoreTracked<S extends TrackedStoreApi<unknown>>(api: S): ExtractState<S>;
export function useStoreTracked<S extends TrackedStoreApi<unknown>, U>(
  api: S,
  selector: Selector<ExtractState<S>, U>,
  equalityFn?: EqualityFn<U>
): U;
export function useStoreTracked<TState, StateSlice>(
  api: TrackedStoreApi<TState>,
  selector: Selector<TState, StateSlice> = identity as Selector<TState, StateSlice>,
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
  // Zustand requires both generic parameters for module augmentation.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const trackedProperties: Listeners<PropertyKey> = new Map();
    const trackedNodes: Listeners<string> = new Map();
    const trackedEdges: Listeners<string> = new Map();
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
      let dependencies = createDependencies();
      let snapshotState: ReactFlowState | undefined;
      let snapshot: Snapshot<U> | undefined;
      let initialSnapshot: Snapshot<U> | undefined;

      const evaluate = (state: ReactFlowState, reads: Dependencies): Snapshot<U> => {
        const track = (property: PropertyKey) => {
          if (typeof Reflect.get(state, property) !== 'function') {
            reads.properties.add(property);
          }
        };
        const proxy = new Proxy(state, {
          get(target, property) {
            if (property === 'getInternalNodeById') {
              return (id: string) => {
                const node = target.nodeLookup.get(id);
                if (reads.nodes === noLookupReads) reads.nodes = new Map();
                reads.nodes.set(id, node);
                return node;
              };
            }
            if (property === 'getEdgeById') {
              return (id: string) => {
                const edge = target.edgeLookup.get(id);
                if (reads.edges === noLookupReads) reads.edges = new Map();
                reads.edges.set(id, edge);
                return edge;
              };
            }
            const value: unknown = Reflect.get(target, property);
            if (typeof value !== 'function') {
              reads.properties.add(property);
            }
            return value;
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
          const value = selector(proxy as TrackedState<ReactFlowState>);
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

      const refresh = (affected = false) => {
        const state = get();
        if (snapshot && snapshotState === state) {
          return;
        }
        if (!affected && snapshot && snapshotState && !dependenciesChanged(snapshotState, state, dependencies)) {
          snapshotState = state;
          return;
        }

        const nextDependencies = createDependencies();
        const nextSnapshot = evaluate(state, nextDependencies);
        if (!snapshot || snapshot.failed || nextSnapshot.failed || !equalityFn(snapshot.value, nextSnapshot.value)) {
          snapshot = nextSnapshot;
        }
        snapshotState = state;

        if (listeners.size) {
          reconcile(trackedProperties, dependencies.properties, nextDependencies.properties, update);
          reconcile(trackedNodes, dependencies.nodes, nextDependencies.nodes, update);
          reconcile(trackedEdges, dependencies.edges, nextDependencies.edges, update);
        }
        dependencies = nextDependencies;
      };

      const update = () => {
        const previous = snapshot;
        // Dispatch already checked the dependencies; do not compare them a second time.
        refresh(true);
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
            for (const property of dependencies.properties) attach(trackedProperties, property, update);
            for (const id of dependencies.nodes.keys()) attach(trackedNodes, id, update);
            for (const id of dependencies.edges.keys()) attach(trackedEdges, id, update);
          }
          return () => {
            listeners.delete(callback);
            if (!listeners.size) {
              for (const property of dependencies.properties) detach(trackedProperties, property, update);
              for (const id of dependencies.nodes.keys()) detach(trackedNodes, id, update);
              for (const id of dependencies.edges.keys()) detach(trackedEdges, id, update);
            }
          };
        },
        () => {
          refresh();
          return read(snapshot!);
        },
        () => {
          initialSnapshot ??= evaluate(store.getInitialState(), createDependencies());
          return read(initialSnapshot);
        },
      ];
      subscriptions.set(equalityFn, subscription);
      return subscription;
    };

    const initialState = initializer(set, get, trackedStore);

    store.subscribe((state, previousState) => {
      const affected = new Set<() => void>();
      for (const [property, subscribers] of trackedProperties) {
        if (subscribers.size && propertyChanged(previousState, state, property)) {
          for (const subscriber of subscribers) {
            affected.add(subscriber);
          }
        }
      }
      // Consume each change set only once. Viewport and other unrelated updates do no per-ID work.
      if (state.nodeLookup !== previousState.nodeLookup) {
        collect(trackedNodes, trackedNodes.keys(), affected);
      } else if (state.nodeLookupChanges !== previousState.nodeLookupChanges) {
        collect(trackedNodes, state.nodeLookupChanges, affected);
      }
      if (state.edgeLookup !== previousState.edgeLookup) {
        collect(trackedEdges, trackedEdges.keys(), affected);
      } else if (state.edgeLookupChanges !== previousState.edgeLookupChanges) {
        collect(trackedEdges, state.edgeLookupChanges, affected);
      }
      for (const subscriber of affected) {
        subscriber();
      }
    });

    return initialState;
  };
