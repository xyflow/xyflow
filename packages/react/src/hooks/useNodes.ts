import { useSyncExternalStore } from 'react';

import { useNodesStore, useReactFlowStoreApi, useShallow } from './useReactFlowStore';
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

  const subscribe = (onStoreChange: () => void) => store.getState().pubSub.subscribeToNode(id, onStoreChange);

  const getSnapshot = () => nodesStore.getState().nodeLookup.get(id)?.internals.userNode as NodeType | undefined;

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

  const subscribe = (onStoreChange: () => void) => store.getState().pubSub.subscribeToNode(id, onStoreChange);

  const getSnapshot = () => nodesStore.getState().nodeLookup.get(id) as InternalNode<NodeType> | undefined;

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * This hook returns set of specific internal nodes and subscribes
 * only to those nodes. Missing IDs are omitted and duplicate IDs are ignored.
 * Reordering the IDs preserves the previous set and result order.
 *
 * @public
 * @param ids - An array of node IDs to observe. An empty array returns no nodes.
 * @returns The matching internal nodes.
 */
export function useInternalNodes<NodeType extends Node = Node>(ids: readonly string[]): InternalNode<NodeType>[] {
  const { store, nodesStore } = useReactFlowStoreApi<NodeType>();
  const nodeIds = useShallow((value: readonly string[]) => new Set(value))(ids);

  const subscribe = (onStoreChange: () => void) => store.getState().pubSub.subscribeToNodes(nodeIds, onStoreChange);

  const selectSnapshot = useShallow(() => {
    const { nodeLookup } = nodesStore.getState();
    const nodes: InternalNode<NodeType>[] = [];

    for (const id of nodeIds) {
      const node = nodeLookup.get(id);
      if (node) {
        nodes.push(node);
      }
    }

    return nodes;
  });

  const getSnapshot = () => selectSnapshot(undefined);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
