import { type NodeDragItem, type XYPosition, InternalNodeBase, NodeBase, NodeLookup, SnapGrid } from '../types';
import { snapPosition } from '../utils';

export function isParentSelected<NodeType extends NodeBase>(node: NodeType, nodeLookup: NodeLookup): boolean {
  if (!node.parentId) {
    return false;
  }

  const parentNode = nodeLookup.get(node.parentId);

  if (!parentNode) {
    return false;
  }

  if (parentNode.selected) {
    return true;
  }

  return isParentSelected(parentNode, nodeLookup);
}

export function hasSelector(target: Element | EventTarget | null, selector: string, domNode: Element): boolean {
  let current = target as Partial<Element> | null | undefined;

  do {
    if (current?.matches?.(selector)) return true;
    if (current === domNode) return false;
    current = current?.parentElement;
  } while (current);

  return false;
}

// looks for all selected nodes and created a NodeDragItem for each of them
export function getDragItems<NodeType extends NodeBase>(
  nodeLookup: Map<string, InternalNodeBase<NodeType>>,
  nodesDraggable: boolean,
  mousePos: XYPosition,
  nodeId?: string
): Map<string, NodeDragItem> {
  const dragItems = new Map<string, NodeDragItem>();

  for (const [id, node] of nodeLookup) {
    if (
      (node.selected || node.id === nodeId) &&
      (!node.parentId || !isParentSelected(node, nodeLookup)) &&
      (node.draggable || (nodesDraggable && typeof node.draggable === 'undefined'))
    ) {
      const internalNode = nodeLookup.get(id);

      if (internalNode) {
        dragItems.set(id, {
          id,
          position: internalNode.position || { x: 0, y: 0 },
          distance: {
            x: mousePos.x - internalNode.internals.positionAbsolute.x,
            y: mousePos.y - internalNode.internals.positionAbsolute.y,
          },
          extent: internalNode.extent,
          parentId: internalNode.parentId,
          origin: internalNode.origin,
          expandParent: internalNode.expandParent,
          internals: {
            positionAbsolute: internalNode.internals.positionAbsolute || { x: 0, y: 0 },
          },
          measured: {
            width: internalNode.measured.width ?? 0,
            height: internalNode.measured.height ?? 0,
          },
        });
      }
    }
  }

  return dragItems;
}

/*
 * returns two params:
 * 1. the dragged node (or the first of the list, if we are dragging a node selection)
 * 2. array of selected nodes (for multi selections)
 */
export function getEventHandlerParams<NodeType extends InternalNodeBase>({
  nodeId,
  dragItems,
  nodeLookup,
  dragging = true,
}: {
  nodeId?: string;
  dragItems: Map<string, NodeDragItem>;
  nodeLookup: Map<string, NodeType>;
  dragging?: boolean;
}): [NodeBase, NodeBase[]] {
  const nodesFromDragItems: NodeBase[] = [];

  for (const [id, dragItem] of dragItems) {
    const node = nodeLookup.get(id)?.internals.userNode;

    if (node) {
      nodesFromDragItems.push({
        ...node,
        position: dragItem.position,
        dragging,
      });
    }
  }

  if (!nodeId) {
    return [nodesFromDragItems[0], nodesFromDragItems];
  }

  const node = nodeLookup.get(nodeId)?.internals.userNode;

  return [
    !node
      ? nodesFromDragItems[0]
      : {
          ...node,
          position: dragItems.get(nodeId)?.position || node.position,
          dragging,
        },
    nodesFromDragItems,
  ];
}

/**
 * If a selection is being dragged we want to apply the same snap offset to all nodes in the selection.
 * This function calculates the snap offset based on the first node in the selection.
 */
export function calculateSnapOffset({
  dragItems,
  snapGrid,
  x,
  y,
}: {
  dragItems: Map<string, NodeDragItem>;
  snapGrid: SnapGrid;
  x: number;
  y: number;
}) {
  const refDragItem = dragItems.values().next().value;

  if (!refDragItem) {
    return null;
  }

  const refPos = {
    x: x - refDragItem.distance.x,
    y: y - refDragItem.distance.y,
  };
  const refPosSnapped = snapPosition(refPos, snapGrid);

  return {
    x: refPosSnapped.x - refPos.x,
    y: refPosSnapped.y - refPos.y,
  };
}
