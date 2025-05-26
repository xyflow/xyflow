import type { DistributivePick } from '@xyflow/system';
import type { ComputedRef, MaybeRefOrGetter } from 'vue';
import type { InternalNode, Node } from '../types';
import { computed, toValue } from 'vue';
import { warn } from '../utils';
import { useVueFlow } from './useVueFlow';

// `DistributivePick` (over `Pick`) distributes across a union `NodeType`, so the result is a discriminated
// union — checking `.type` narrows `.data`. Mirrors xyflow/react & xyflow/svelte.
type NodeData<NodeType extends Node = InternalNode> = DistributivePick<NodeType, 'id' | 'type' | 'data'>;

/**
 * Composable for receiving data of one or multiple nodes
 *
 * @public
 * @param nodeId - The id (or ids) of the node to get the data from
 * @param guard - Optional guard function to narrow down the node type
 * @returns An array of data objects
 */
export function useNodesData<NodeType extends Node = InternalNode>(
  nodeId: MaybeRefOrGetter<string>,
): ComputedRef<NodeData<NodeType> | null>;
export function useNodesData<NodeType extends Node = InternalNode>(
  nodeIds: MaybeRefOrGetter<string[]>,
): ComputedRef<NodeData<NodeType>[]>;
export function useNodesData<NodeType extends Node = InternalNode>(
  nodeIds: MaybeRefOrGetter<string[]>,
  guard: (node: Node) => node is NodeType,
): ComputedRef<NodeData<NodeType>[]>;
export function useNodesData(_nodeIds: any): any {
  const { getNode } = useVueFlow();

  return computed({
    get() {
      const nodeIds = toValue(_nodeIds);

      if (!Array.isArray(nodeIds)) {
        const node = getNode(nodeIds);

        if (node) {
          return {
            id: node.id,
            type: node.type,
            data: node.data,
          };
        }

        return null;
      }

      const data: NodeData<Node>[] = [];

      for (const nodeId of nodeIds) {
        const node = getNode(nodeId);

        if (node) {
          data.push({
            id: node.id,
            type: node.type,
            data: node.data,
          });
        }
      }

      return data;
    },
    set() {
      // noop
      warn('You are trying to set node data via useNodesData. This is not supported.');
    },
  });
}
