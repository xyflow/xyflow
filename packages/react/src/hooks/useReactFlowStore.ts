import { useContext, useMemo } from 'react';
import type { StoreApi } from 'zustand';
import { useStoreWithEqualityFn as useZustandStore } from 'zustand/traditional';
import { errorMessages } from '@xyflow/system';

import StoreContext from '../contexts/StoreContext';
import type { Edge, Node, ReactFlowState } from '../types';

const zustandErrorMessage = errorMessages['error001']('react');

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
 * for preventing unnecessary re-renders. Pass `shallow` from `@xyflow/react` for shallow comparisons.
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
function useReactFlowStore<StateSlice = unknown>(
  selector: (state: ReactFlowState) => StateSlice,
  equalityFn?: (a: StateSlice, b: StateSlice) => boolean
) {
  const store = useContext(StoreContext);

  if (store === null) {
    throw new Error(zustandErrorMessage);
  }

  return useZustandStore(store, selector, equalityFn);
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
function useReactFlowStoreApi<NodeType extends Node = Node, EdgeType extends Edge = Edge>(): StoreApi<
  ReactFlowState<NodeType, EdgeType>
> {
  const store = useContext(StoreContext);

  if (store === null) {
    throw new Error(zustandErrorMessage);
  }

  return useMemo(
    () =>
      ({
        getState: store.getState,
        setState: store.setState,
        subscribe: store.subscribe,
      }) as StoreApi<ReactFlowState> as unknown as StoreApi<ReactFlowState<NodeType, EdgeType>>,
    [store]
  );
}

export { useReactFlowStore, useReactFlowStoreApi };
