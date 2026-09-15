import { useContext, useRef } from 'react';
import { useStore as useZustandStore } from 'zustand';
import { errorMessages } from '@xyflow/system';

import StoreContext from '../contexts/StoreContext';
import type {
  Edge,
  Node,
  ReactFlowState,
  ReactFlowStoreApi,
  ViewportStore,
  ConnectionStore,
  NodesStore,
  EdgesStore,
  SelectionStore,
} from '../types';

const zustandErrorMessage = errorMessages['error001']('react');

/**
 * This hook subscribes to the shared settings and actions of the React Flow
 * component. Use `useViewportStore`, `useConnectionStore`, `useNodesStore`,
 * `useEdgesStore`, or `useSelectionStore` for their respective state. These hooks
 * use [Zustand](https://github.com/pmndrs/zustand) for subscriptions.
 *
 * @public
 * @param selector - A selector function that returns a slice of the flow's internal state.
 * Extracting or transforming just the state you need is a good practice to avoid unnecessary
 * re-renders.
 * For shallow comparisons, use `useShallow` from `@xyflow/react` by wrapping your selector:
 * `useReactFlowStore(useShallow(selector))`.
 * @returns The selected state slice.
 *
 * @example
 * ```ts
 * const nodesDraggable = useReactFlowStore((state) => state.nodesDraggable);
 * ```
 *
 * @remarks This hook should only be used if there is no other way to access the internal
 * state. For many of the common use cases, there are dedicated hooks available
 * such as {@link useReactFlow}, {@link useViewport}, etc.
 */
function useReactFlowStore<StateSlice = unknown>(selector: (state: ReactFlowState) => StateSlice) {
  const { store } = useReactFlowStoreApi();
  return useZustandStore(store, selector);
}

/**
 * In some cases, you might need to access the stores directly. This hook returns the store APIs which can be used on demand to access state or dispatch actions.
 *
 * @returns The main, viewport, connection, nodes, edges, and selection store APIs.
 * @example
 * ```ts
 * const { nodesStore } = useReactFlowStoreApi();
 * const nodes = nodesStore.getState().nodes;
 * ```
 *
 * @remarks This hook should only be used if there is no other way to access the internal
 * state. For many of the common use cases, there are dedicated hooks available
 * such as {@link useReactFlow}, {@link useViewport}, etc.
 */
function useReactFlowStoreApi<NodeType extends Node = Node, EdgeType extends Edge = Edge>(): ReactFlowStoreApi<
  NodeType,
  EdgeType
> {
  const stores = useContext(StoreContext);

  if (stores === null) {
    throw new Error(zustandErrorMessage);
  }

  return stores as unknown as ReactFlowStoreApi<NodeType, EdgeType>;
}

export function useViewportStore<StateSlice>(selector: (state: ViewportStore) => StateSlice) {
  return useZustandStore(useReactFlowStoreApi().viewportStore, selector);
}

export function useConnectionStore<StateSlice>(selector: (state: ConnectionStore) => StateSlice) {
  return useZustandStore(useReactFlowStoreApi().connectionStore, selector);
}

export function useNodesStore<StateSlice>(selector: (state: NodesStore) => StateSlice) {
  return useZustandStore(useReactFlowStoreApi().nodesStore, selector);
}

export function useEdgesStore<StateSlice>(selector: (state: EdgesStore) => StateSlice) {
  return useZustandStore(useReactFlowStoreApi().edgesStore, selector);
}

export function useSelectionStore<StateSlice>(selector: (state: SelectionStore) => StateSlice) {
  return useZustandStore(useReactFlowStoreApi().selectionStore, selector);
}

export { useReactFlowStore, useReactFlowStoreApi };
export { useShallow } from './useShallow';

export function useCustomDiff<S, U>(selector: (state: S) => U, compare: (a: U, b: U) => boolean): (state: S) => U {
  const prev = useRef<U>();
  return (state) => {
    const next = selector(state);
    return prev.current && compare(prev.current, next) ? prev.current : (prev.current = next);
  };
}
