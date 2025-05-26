import type { XYPosition } from '@xyflow/system';
import type { NodeDragItem } from '../types';
import { getNodeDimensions } from '@xyflow/system';
import { calcNextPosition } from '../utils';
import { storeToRefs } from './storeToRefs';
import { useStore } from './useStore';
import { useVueFlow } from './useVueFlow';

/**
 * Composable for updating the position of nodes.
 *
 * @internal
 */
export function useUpdateNodePositions() {
  const { getSelectedNodes, updateNodePositions, getInternalNode, emits } = useVueFlow();
  const { nodeExtent, snapGrid, snapToGrid, nodesDraggable } = storeToRefs(useStore());

  return (positionDiff: XYPosition, isShiftPressed = false) => {
    // by default a node moves 5px on each key press, or 20px if shift is pressed
    // if snap grid is enabled, we use that for the velocity.
    const xVelo = snapToGrid.value ? snapGrid.value[0] : 5;
    const yVelo = snapToGrid.value ? snapGrid.value[1] : 5;
    const factor = isShiftPressed ? 4 : 1;

    const positionDiffX = positionDiff.x * xVelo * factor;
    const positionDiffY = positionDiff.y * yVelo * factor;

    const nodeUpdates: NodeDragItem[] = [];
    for (const node of getSelectedNodes.value) {
      if (node.draggable || (nodesDraggable.value && typeof node.draggable === 'undefined')) {
        // `getSelectedNodes` returns user `Node`s — resolve the enriched InternalNode for internals/measured
        const internalNode = getInternalNode(node.id);
        if (!internalNode) {
          continue;
        }

        const nextPosition = {
          x: internalNode.internals.positionAbsolute.x + positionDiffX,
          y: internalNode.internals.positionAbsolute.y + positionDiffY,
        };

        const { position } = calcNextPosition(
          internalNode,
          nextPosition,
          emits.error,
          nodeExtent.value,
          node.parentId ? getInternalNode(node.parentId) : undefined,
        );

        nodeUpdates.push({
          id: node.id,
          position,
          distance: { x: positionDiff.x, y: positionDiff.y },
          measured: getNodeDimensions(internalNode),
          internals: {
            positionAbsolute: { x: internalNode.internals.positionAbsolute.x, y: internalNode.internals.positionAbsolute.y },
          },
        });
      }
    }

    updateNodePositions(nodeUpdates, true, false);
  };
}
