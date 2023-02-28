import { derived } from 'svelte/store';
import { Position } from '@reactflow/system';

import { getEdgePositions, getHandle, getNodeData } from '$lib/container/EdgeRenderer/utils';
import type { WrapEdgeProps } from '$lib/types';
import type { SvelteFlowStoreState } from './types';

export function getEdgesLayouted(store: SvelteFlowStoreState) {
  return derived([store.edges, store.nodes], ([$edges, $nodes]) => {
    return $edges
      .map((edge) => {
        const sourceNode = $nodes.find((node) => node.id === edge.source);
        const targetNode = $nodes.find((node) => node.id === edge.target);
        const [sourceNodeRect, sourceHandleBounds, sourceIsValid] = getNodeData(sourceNode);
        const [targetNodeRect, targetHandleBounds, targetIsValid] = getNodeData(targetNode);

        if (!sourceIsValid || !targetIsValid) {
          return null;
        }

        const edgeType = edge.type || 'default';

        const targetNodeHandles = targetHandleBounds!.target;
        const sourceHandle = getHandle(sourceHandleBounds!.source!, edge.sourceHandle);
        const targetHandle = getHandle(targetNodeHandles!, edge.targetHandle);
        const sourcePosition = sourceHandle?.position || Position.Bottom;
        const targetPosition = targetHandle?.position || Position.Top;

        if (!sourceHandle || !targetHandle) {
          return null;
        }

        const { sourceX, sourceY, targetX, targetY } = getEdgePositions(
          sourceNodeRect,
          sourceHandle,
          sourcePosition,
          targetNodeRect,
          targetHandle,
          targetPosition
        );

        // we nee to do this to match the types
        const sourceHandleId = edge.sourceHandle;
        const targetHandleId = edge.targetHandle;

        return {
          ...edge,
          type: edgeType,
          sourceX,
          sourceY,
          targetX,
          targetY,
          sourcePosition,
          targetPosition,
          sourceHandleId,
          targetHandleId
        };
      })
      .filter((e) => e !== null) as WrapEdgeProps[];
  });
}
