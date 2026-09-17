import { useCallback, useSyncExternalStore } from 'react';

import { useReactFlowStoreApi, useShallow } from './useReactFlowStore';
import type { Edge, Node } from '../types';

/**
 * This hook returns the current edges, optionally limited to an array of IDs.
 * When IDs are provided, it subscribes only to those edges. Missing IDs are omitted
 * and results follow the iteration order of the IDs. An empty collection returns no edges.
 * An optional selector can select a slice; results are compared shallowly.
 *
 * @public
 * @param ids - Optional IDs to subscribe to. Omit to subscribe to all edges.
 * @param selector - Optional selector whose result is compared shallowly.
 * @returns The matching edges, or the selected slice.
 *
 * @example
 * ```tsx
 *import { useEdges } from '@xyflow/react';
 *
 *export default function () {
 *  const edges = useEdges();
 *
 *  return <div>There are currently {edges.length} edges!</div>;
 *}
 *```
 */
export function useEdges<EdgeType extends Edge = Edge, StateSlice = EdgeType[]>(
  ids?: readonly string[],
  selector?: (edges: EdgeType[]) => StateSlice
): StateSlice {
  const { store, edgesStore } = useReactFlowStoreApi<Node, EdgeType>();
  // Compare IDs by value so inline arrays do not recreate subscriptions on every render.
  const itemIds = useShallow((value: typeof ids) => value?.slice())(ids);

  const subscribe = useCallback(
    (onStoreChange: () => void) =>
      itemIds === undefined
        ? edgesStore.subscribe(onStoreChange)
        : store.getState().pubSub.subscribeToEdges(itemIds, onStoreChange),
    [store, edgesStore, itemIds]
  );

  const selectSnapshot = useShallow(() => {
    const state = edgesStore.getState();
    const edges =
      itemIds === undefined
        ? state.edges
        : itemIds.flatMap((id) => {
            const edge = state.edgeLookup.get(id);
            return edge ? [edge] : [];
          });

    return selector ? selector(edges) : (edges as StateSlice);
  });

  const getSnapshot = () => selectSnapshot(undefined);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * This hook returns the edge with the given id. Components that use this hook
 * will re-render **whenever the edge changes**.
 *
 * @public
 * @param id - The id of the edge to return.
 * @returns The edge with the given id.
 *
 * @example
 * ```tsx
 *import { useEdge } from '@xyflow/react';
 *
 *export default function () {
 *  const edge = useEdge('1');
 *
 *  return <div>Edge: {edge?.data.label}</div>;
 *}
 *```
 */
export function useEdge<EdgeType extends Edge = Edge>(id: string): EdgeType | undefined {
  const { store, edgesStore } = useReactFlowStoreApi();

  const subscribe = useCallback(
    (onStoreChange: () => void) => store.getState().pubSub.subscribeToEdge(id, onStoreChange),
    [store, id]
  );

  const getSnapshot = useCallback(
    () => edgesStore.getState().edgeLookup.get(id) as EdgeType | undefined,
    [edgesStore, id]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
