import type { StateCreator, StoreMutatorIdentifier, Mutate, StoreApi } from 'zustand';

// Types are adopted from https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md#middleware-that-changes-the-store-type
export type Write<T extends object, U extends object> = Omit<T, keyof U> & U;
type Cast<T, U> = T extends U ? T : U;

export type BatchUpdatesFn = (fn: () => void) => void;

type BatchMiddleware = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: StateCreator<T, [...Mps, ['batchUpdates', BatchUpdatesFn]], Mcs>
) => StateCreator<T, Mps, [['batchUpdates', BatchUpdatesFn], ...Mcs]>;

declare module 'zustand' {
  interface StoreMutators<S, A> {
    batchUpdates: Write<Cast<S, object>, { batchUpdates: BatchUpdatesFn }>;
  }
}

type BatchMiddlewareImpl = <T>(stateCreator: StateCreator<T, [], []>) => StateCreator<T, [], []>;

const batchMiddleware: BatchMiddlewareImpl = (stateCreator) => (originalSet, originalGet, _store) => {
  type StoreType = ReturnType<typeof stateCreator>;

  const store = _store as Mutate<StoreApi<StoreType>, [['batchUpdates', BatchUpdatesFn]]>;

  // End of TS boilerplate, start of actual middleware implementation:
  let batchingState: { isBatching: true; intermediateStoreState: StoreType } | { isBatching: false } = {
    isBatching: false,
  };

  const batchingGet: typeof originalGet = () => {
    if (!batchingState.isBatching) return originalGet();

    return batchingState.intermediateStoreState;
  };

  const batchingSet: typeof originalSet = (partial, replace) => {
    if (!batchingState.isBatching) return originalSet(partial);

    if (replace) {
      // `replace` is true when the user explicitly passes it into `set()`: https://docs.pmnd.rs/zustand/guides/immutable-state-and-merging#replace-flag
      // If we ever need to support this, we can do the following:
      // - check if a user is calling `set()` with replace=true; and if yes,
      //   - replace `intermediateStoreState` with the new state
      //   - set a flag that will tell `unsafe_stopBatching()` to call `store.setState()` with replace=true
      //   - keep batching subsequent updates as usual
      throw new Error('Replacing the whole state inside `store.batchUpdates()` is not implemented');
    }

    if (partial instanceof Function) {
      // `partial instanceof Function` is true when the user passes a function instead of a partial state object into `set()`:
      //   storeApi.setState(state => ({ foo: state.nodes.length > 0 ? 'bar' : 'baz' }))
      batchingState.intermediateStoreState = {
        ...batchingState.intermediateStoreState,
        ...partial(batchingState.intermediateStoreState),
      };
    }

    batchingState.intermediateStoreState = { ...batchingState.intermediateStoreState, ...partial };
  };

  // Replace the original `getState()` and `setState()` as they may be called
  // in-between batching – and should
  // 1) provide correct (not stale) state values when called,
  // 2) batch updates instead of applying them immediately.
  store.getState = batchingGet;
  store.setState = batchingSet;

  store.batchUpdates = (fn) => {
    batchingState = { isBatching: true, intermediateStoreState: originalGet() };

    fn();

    originalSet(batchingState.intermediateStoreState);
    batchingState = { isBatching: false };
  };

  return stateCreator(batchingSet, batchingGet, _store);
  // End of actual middleware implementation
};

export default batchMiddleware as unknown as BatchMiddleware;
