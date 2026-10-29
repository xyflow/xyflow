import type { DistributivePick } from '@xyflow/system';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import type { InternalNode, Node } from '../types';
import { shallowNodeData } from '@xyflow/system';
import { computed, toValue } from 'vue';
import { warn } from '../utils';
import { useVueFlow } from './useVueFlow';

// `DistributivePick` (over `Pick`) distributes across a union `NodeType`, so the result is a discriminated
// union — checking `.type` narrows `.data`.
type NodeData<NodeType extends Node = InternalNode> = DistributivePick<NodeType, 'id' | 'type' | 'data'>;

/**
 * Composable that lets you subscribe to changes of a specific node's `data` object.
 *
 * @public
 * @param nodeId - The id (or ids) of the node to get the data from
 * @returns An object (or array of objects) with `id`, `type`, `data` representing each node
 */
export function useNodesData<NodeType extends Node = InternalNode>(
  nodeId: MaybeRefOrGetter<string>,
): ComputedRef<NodeData<NodeType> | null>;
export function useNodesData<NodeType extends Node = InternalNode>(
  nodeIds: MaybeRefOrGetter<string[]>,
): ComputedRef<NodeData<NodeType>[]>;
export function useNodesData(_nodeIds: any): any {
  const { getNode } = useVueFlow();

  return computed<NodeData<Node> | NodeData<Node>[] | null>({
    get(prev) {
      const nodeIds = toValue(_nodeIds);

      let next: NodeData<Node> | NodeData<Node>[] | null;

      if (!Array.isArray(nodeIds)) {
        const node = getNode(nodeIds);
        next = node ? { id: node.id, type: node.type, data: node.data } : null;
      }
      else {
        const data: NodeData<Node>[] = [];

        for (const nodeId of nodeIds) {
          const node = getNode(nodeId);

          if (node) {
            data.push({ id: node.id, type: node.type, data: node.data });
          }
        }

        next = data;
      }

      // keep the previous val when the shallow `{ id, type, data }` shape is unchanged,
      // so consumers don't re-run on unrelated node updates like position or selection
      return prev != null && shallowNodeData(next, prev) ? prev : next;
    },
    set() {
      warn('You are trying to set node data via useNodesData. This is not supported.');
    },
  });
}
