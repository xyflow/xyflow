import { useContext, useMemo } from 'react';
import { errorMessages } from '@xyflow/system';

import StoreContext from '../contexts/StoreContext';
import { useStoreTracked, type TrackedStoreApi, type TrackedState } from '../store/middleware';
import type { Edge, Node, ReactFlowState } from '../types';

const zustandErrorMessage = errorMessages['error001']('react');

/**
 * This hook can be used to subscribe to internal state changes of the React Flow
 * component. Selectors track the state properties they read and subscribe to changes
 * in those properties.
 *
 * @public
 * @param selector - A selector function that returns a slice of the flow's internal state.
 * Use `state.getInternalNodeById(id)` or `state.getEdgeById(id)` to subscribe to a single
 * lookup entry. These helpers are available only inside tracked selectors.
 * Extracting or transforming just the state you need is a good practice to avoid unnecessary
 * re-renders.
 * @param equalityFn - A function to compare the previous and next value. This is incredibly useful
 * for preventing unnecessary re-renders. For shallow comparisons, prefer `useShallow` from
 * `zustand/react/shallow` by wrapping your selector: `useReactFlowStore(useShallow(selector))`. Passing
 * `zustand/shallow` as the second argument is still supported for backwards compatibility.
 * @returns The selected state slice.
 *
 * @example
 * ```ts
 * const node = useReactFlowStore((state) => state.getInternalNodeById('node-1'));
 * ```
 *
 * @remarks This hook should only be used if there is no other way to access the internal
 * state. For many of the common use cases, there are dedicated hooks available
 * such as {@link useReactFlow}, {@link useViewport}, etc.
 */
function useReactFlowStore<StateSlice = unknown>(
  selector: (state: TrackedState<ReactFlowState>) => StateSlice,
  equalityFn?: (previous: StateSlice, next: StateSlice) => boolean
) {
  const store = useContext(StoreContext);

  if (store === null) {
    throw new Error(zustandErrorMessage);
  }

  return useStoreTracked(store, selector, equalityFn);
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
function useReactFlowStoreApi<NodeType extends Node = Node, EdgeType extends Edge = Edge>(): TrackedStoreApi<
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
        getInitialState: store.getInitialState,
        setState: store.setState,
        subscribe: store.subscribe,
        subscribeTracked: store.subscribeTracked,
      }) as TrackedStoreApi<ReactFlowState> as unknown as TrackedStoreApi<ReactFlowState<NodeType, EdgeType>>,
    [store]
  );
}

export { useReactFlowStore, useReactFlowStoreApi };
export { useShallow } from 'zustand/react/shallow';
