import { useCallback, useSyncExternalStore } from 'react';

import { useReactFlowStoreApi, useShallow } from './useReactFlowStore';
import type { InternalNode, Node } from '../types';

/**
 * This hook returns the current nodes, optionally limited to an array of IDs.
 * When IDs are provided, it subscribes only to those nodes. Missing IDs are omitted
 * and results follow the iteration order of the IDs. An empty collection returns no nodes.
 * An optional selector can select a slice; results are compared shallowly.
 *
 * @public
 * @param ids - Optional IDs to subscribe to. Omit to subscribe to all nodes.
 * @param selector - Optional selector whose result is compared shallowly.
 * @returns The matching nodes, or the selected slice.
 *
 * @example
 * ```jsx
 *import { useNodes } from '@xyflow/react';
 *
 *export default function() {
 *  const nodes = useNodes();
 *
 *  return <div>There are currently {nodes.length} nodes!</div>;
 *}
 *```
 */
export function useNodes<NodeType extends Node = Node, StateSlice = NodeType[]>(
  ids?: readonly string[],
  selector?: (nodes: NodeType[]) => StateSlice
): StateSlice {
  const { store, nodesStore } = useReactFlowStoreApi<NodeType>();
  // Compare IDs by value so inline arrays do not recreate subscriptions on every render.
  const itemIds = useShallow((value: typeof ids) => value?.slice())(ids);

  const subscribe = useCallback(
    (onStoreChange: () => void) =>
      itemIds === undefined
        ? nodesStore.subscribe(onStoreChange)
        : store.getState().pubSub.subscribeToNodes(itemIds, onStoreChange),
    [store, nodesStore, itemIds]
  );

  const selectSnapshot = useShallow(() => {
    const state = nodesStore.getState();
    const nodes =
      itemIds === undefined
        ? state.nodes
        : itemIds.flatMap((id) => {
            const node = state.nodeLookup.get(id)?.internals.userNode;
            return node ? [node] : [];
          });

    return selector ? selector(nodes) : (nodes as StateSlice);
  });

  const getSnapshot = () => selectSnapshot(undefined);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * This hook returns the node with the given id. Components that use this hook
 * will re-render **whenever the node changes**.
 *
 * @public
 * @param id - The id of the node to return.
 * @returns The node with the given id.
 *
 * @example
 * ```tsx
 *import { useNode } from '@xyflow/react';
 *
 *export default function () {
 *  const node = useNode('1');
 *
 *  return <div>Node: {node?.data.label}</div>;
 *}
 *```
 */
export function useNode<NodeType extends Node = Node>(id: string): NodeType | undefined {
  const { store, nodesStore } = useReactFlowStoreApi();

  const subscribe = useCallback(
    (onStoreChange: () => void) => store.getState().pubSub.subscribeToNode(id, onStoreChange),
    [store, id]
  );

  const getSnapshot = useCallback(
    () => nodesStore.getState().nodeLookup.get(id)?.internals.userNode as NodeType | undefined,
    [nodesStore, id]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * This hook returns the internal representation of a specific node.
 * Components that use this hook will re-render **whenever the node changes**,
 * including when a node is selected or moved.
 *
 * @public
 * @param id - The ID of a node you want to observe.
 * @returns The `InternalNode` object for the node with the given ID.
 *
 * @example
 * ```tsx
 *import { useInternalNode } from '@xyflow/react';
 *
 *export default function () {
 *  const internalNode = useInternalNode('node-1');
 *  const absolutePosition = internalNode.internals.positionAbsolute;
 *
 *  return (
 *    <div>
 *      The absolute position of the node is at:
 *      <p>x: {absolutePosition.x}</p>
 *      <p>y: {absolutePosition.y}</p>
 *    </div>
 *  );
 *}
 *```
 */
export function useInternalNode<NodeType extends Node = Node>(id: string): InternalNode<NodeType> | undefined {
  const { store, nodesStore } = useReactFlowStoreApi();

  const subscribe = useCallback(
    (onStoreChange: () => void) => store.getState().pubSub.subscribeToNode(id, onStoreChange),
    [store, id]
  );

  const getSnapshot = useCallback(
    () => nodesStore.getState().nodeLookup.get(id) as InternalNode<NodeType> | undefined,
    [nodesStore, id]
  );

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
