import { useCallback, useSyncExternalStore } from 'react';

import { useNodesStore, useReactFlowStoreApi } from './useReactFlowStore';
import type { InternalNode, Node } from '../types';

/**
 * This hook returns an array of the current nodes. Components that use this hook
 * will re-render **whenever any node changes**, including when a node is selected
 * or moved.
 *
 * @public
 * @returns An array of all nodes currently in the flow.
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
export function useNodes<NodeType extends Node = Node>(): NodeType[] {
  const { nodes } = useNodesStore();

  return nodes as NodeType[];
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
