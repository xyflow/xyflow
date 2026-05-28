import { useContext, useMemo, useRef } from 'react';
import { type UseBoundStore, useStore as useZustandStore, type StoreApi } from 'zustand';
import { errorMessages } from '@xyflow/system';

import StoreContext from '../contexts/StoreContext';
import type { Edge, Node, ReactFlowState } from '../types';

const zustandErrorMessage = errorMessages['error001']();

/**
 * This hook can be used to subscribe to internal state changes of the React Flow
 * component. The `useStore` hook is re-exported from the [Zustand](https://github.com/pmndrs/zustand)
 * state management library, so you should check out their docs for more details.
 *
 * @public
 * @param selector - A selector function that returns a slice of the flow's internal state.
 * Extracting or transforming just the state you need is a good practice to avoid unnecessary
 * re-renders.
 * @param equalityFn - A function to compare the previous and next value. This is incredibly useful
 * for preventing unnecessary re-renders. For shallow comparisons, prefer `useShallow` from
 * `zustand/react/shallow` by wrapping your selector: `useStore(useShallow(selector))`. Passing
 * `zustand/shallow` as the second argument is still supported for backwards compatibility.
 * @returns The selected state slice.
 *
 * @example
 * ```ts
 * const nodes = useStore((state) => state.nodes);
 * ```
 *
 * @remarks This hook should only be used if there is no other way to access the internal
 * state. For many of the common use cases, there are dedicated hooks available
 * such as {@link useReactFlow}, {@link useViewport}, etc.
 */
function useStore<StateSlice = unknown>(selector: (state: ReactFlowState) => StateSlice) {
  const store = useContext(StoreContext);

  if (store === null) {
    throw new Error(zustandErrorMessage);
  }

  return useZustandStore(store, selector);
}

/**
 * In some cases, you might need to access the store directly. This hook returns the store object which can be used on demand to access the state or dispatch actions.
 *
 * @returns The store object.
 * @example
 * ```ts
 * const store = useStoreApi();
 * ```
 *
 * @remarks This hook should only be used if there is no other way to access the internal
 * state. For many of the common use cases, there are dedicated hooks available
 * such as {@link useReactFlow}, {@link useViewport}, etc.
 */
function useStoreApi<NodeType extends Node = Node, EdgeType extends Edge = Edge>() {
  const store = useContext(StoreContext) as UseBoundStore<StoreApi<ReactFlowState>>;

  if (store === null) {
    throw new Error(zustandErrorMessage);
  }

  return useMemo(
    () => ({
      getState: store.getState,
      setState: store.setState,
      subscribe: store.subscribe,
    }),
    [store]
  ) as StoreApi<ReactFlowState>;
}

export { useStore, useStoreApi };
export { useShallow } from 'zustand/react/shallow';

export function useCustomDiff<S, U>(selector: (state: S) => U, compare: (a: U, b: U) => boolean): (state: S) => U {
  const prev = useRef<U>();
  return (state) => {
    const next = selector(state);
    return prev.current && compare(prev.current, next) ? prev.current : (prev.current = next);
  };
}
