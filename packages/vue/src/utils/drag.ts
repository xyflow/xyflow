import type { CoordinateExtent, XYPosition } from '@xyflow/system';
import type { InternalNode, NodeDragItem, State } from '../types';
import { clampPosition, getNodeDimensions } from '@xyflow/system';
import { ErrorCode, VueFlowError } from '.';

// The absolute bounds of `parent` — the extent a child with `extent: 'parent'` is clamped to.
function getParentExtent(parent: InternalNode): CoordinateExtent | false {
  if (
    parent
    && typeof parent.internals.positionAbsolute.x !== 'undefined'
    && typeof parent.internals.positionAbsolute.y !== 'undefined'
    && typeof parent.measured.width !== 'undefined'
    && typeof parent.measured.height !== 'undefined'
  ) {
    return [
      [parent.internals.positionAbsolute.x, parent.internals.positionAbsolute.y],
      [
        parent.internals.positionAbsolute.x + parent.measured.width,
        parent.internals.positionAbsolute.y + parent.measured.height,
      ],
    ];
  }

  return false;
}

export function getExtent<T extends NodeDragItem | InternalNode>(
  item: T,
  triggerError: State['hooks']['error']['trigger'],
  extent?: State['nodeExtent'],
  parent?: InternalNode,
) {
  let currentExtent = item.extent || extent;

  if (currentExtent === 'parent' && !item.expandParent) {
    if (item.parentId && parent && item.measured.width && item.measured.height) {
      const parentExtent = getParentExtent(parent);

      if (parentExtent) {
        currentExtent = parentExtent;
      }
    }
    else {
      triggerError(new VueFlowError(ErrorCode.NODE_EXTENT_INVALID, item.id));

      currentExtent = extent;
    }
  }
  else if (Array.isArray(currentExtent)) {
    const parentX = parent?.internals.positionAbsolute.x || 0;
    const parentY = parent?.internals.positionAbsolute.y || 0;

    currentExtent = [
      [currentExtent[0][0] + parentX, currentExtent[0][1] + parentY],
      [currentExtent[1][0] + parentX, currentExtent[1][1] + parentY],
    ];
  }

  return (
    currentExtent === 'parent'
      ? [
          [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
          [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
        ]
      : currentExtent
  ) as CoordinateExtent;
}

export function calcNextPosition(
  node: InternalNode | NodeDragItem,
  nextPosition: XYPosition,
  triggerError: State['hooks']['error']['trigger'],
  nodeExtent?: State['nodeExtent'],
  parentNode?: InternalNode,
) {
  const measured = getNodeDimensions(node);

  // `clampPosition` already subtracts the node's dimensions from the extent's max corner (same as
  // system's own `clampPositionToParent`), so pass `getExtent`'s region straight through — pre-shrinking
  // it by the node size first would double-count it and clamp the node a full width/height too far in.
  const clampedPos = clampPosition(nextPosition, getExtent(node, triggerError, nodeExtent, parentNode), measured);

  return {
    position: {
      x: clampedPos.x - (parentNode?.internals.positionAbsolute.x || 0),
      y: clampedPos.y - (parentNode?.internals.positionAbsolute.y || 0),
    },
    computedPosition: clampedPos,
  };
}
