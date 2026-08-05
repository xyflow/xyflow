import { useCallback } from 'react';

import { useStoreApi } from './useStore';
import { useExternalSnapshot } from './useExternalSnapshot';
import type { InternalNode, Node } from '../types';

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
  const store = useStoreApi();

  /*
   * Subscribe to this one node via the per-node channel, so the hook wakes only when this node
   * changes and stays correct under keyed writes (patchNodes) that bump the channel without a store
   * emit. The snapshot is the node reference itself (not a version counter) so a node that only
   * appears after this hook first runs (e.g. adopted by the StoreUpdater effect after mount) is still
   * picked up when the subscription settles.
   */
  const subscribe = useCallback((onChange: () => void) => store.getState().subscribeNode(id, onChange), [store, id]);
  const compute = useCallback(
    () => store.getState().nodeLookup.get(id) as InternalNode<NodeType> | undefined,
    [store, id]
  );

  return useExternalSnapshot(subscribe, compute, Object.is);
}
