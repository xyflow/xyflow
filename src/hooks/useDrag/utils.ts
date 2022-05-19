import { RefObject } from 'react';

import { CoordinateExtent, Node, NodeDragItem, NodeInternals, XYPosition } from '../../types';
import { clampPosition } from '../../utils';

export function isParentSelected(node: Node, nodeInternals: NodeInternals): boolean {
  if (!node.parentNode) {
    return false;
  }

  const parentNode = nodeInternals.get(node.parentNode);

  if (!parentNode) {
    return false;
  }

  if (parentNode.selected) {
    return true;
  }

  return isParentSelected(parentNode, nodeInternals);
}

export function getParentNodePosition(nodeInternals: NodeInternals, nodeId?: string): XYPosition {
  const parentNodeId = nodeId ? nodeInternals.get(nodeId)?.parentNode : null;
  const parentNode = parentNodeId ? nodeInternals.get(parentNodeId) : null;

  return {
    x: parentNode?.positionAbsolute?.x || 0,
    y: parentNode?.positionAbsolute?.y || 0,
  };
}

export function selectorExistsTargetToNode(target: Element, selector: string, nodeRef: RefObject<Element>): boolean {
  let current = target;

  do {
    if (current?.matches(selector)) return true;
    if (current === nodeRef.current) return false;
    current = current.parentElement as Element;
  } while (current);

  return false;
}

// looks for all selected nodes and created a NodeDragItem for each of them
export function getDragItems(nodeInternals: NodeInternals, mousePos: XYPosition, nodeId?: string): NodeDragItem[] {
  return Array.from(nodeInternals.values())
    .filter((n) => (n.selected || n.id === nodeId) && (!n.parentNode || !isParentSelected(n, nodeInternals)))
    .map((n) => ({
      id: n.id,
      position: n.position,
      distance: {
        x: mousePos.x - n.position.x,
        y: mousePos.y - n.position.y,
      },
      delta: {
        x: 0,
        y: 0,
      },
      extent: n.extent,
      parentNode: n.parentNode,
      width: n.width,
      height: n.height,
    }));
}

export function updatePosition(
  dragItem: NodeDragItem,
  mousePos: XYPosition,
  nodeInternals: NodeInternals,
  nodeExtent?: CoordinateExtent
): NodeDragItem {
  let currentExtent = dragItem.extent || nodeExtent;
  let nextPosition = { x: mousePos.x - dragItem.distance.x, y: mousePos.y - dragItem.distance.y };

  if (dragItem.extent === 'parent') {
    if (dragItem.parentNode && dragItem.width && dragItem.height) {
      const parent = nodeInternals.get(dragItem.parentNode);
      currentExtent =
        parent?.width && parent?.height
          ? [
              [0, 0],
              [parent.width - dragItem.width, parent.height - dragItem.height],
            ]
          : currentExtent;
    } else {
      // @ts-ignore
      if (process.env.NODE_ENV === 'development') {
        console.warn('[React Flow]: Only child nodes can use a parent extent. Help: https://reactflow.dev/error#500');
      }
      currentExtent = nodeExtent;
    }
  }

  nextPosition = currentExtent ? clampPosition(nextPosition, currentExtent as CoordinateExtent) : nextPosition;

  dragItem.delta = {
    x: nextPosition.x - dragItem.position.x,
    y: nextPosition.y - dragItem.position.y,
  };
  dragItem.position = nextPosition;

  return dragItem;
}

// returns two params:
// 1. the dragged node (or the first of the list, if we are dragging a node selection)
// 2. array of selected nodes (handy when multi selection is active)
export function getEventHandlerParams({
  nodeId,
  dragItems,
  nodeInternals,
}: {
  nodeId?: string;
  dragItems: NodeDragItem[];
  nodeInternals: NodeInternals;
}): [Node, Node[]] {
  const extentedDragItems: Node[] = dragItems.map((n) => {
    const node = nodeInternals.get(n.id)!;

    return {
      ...node,
      position: n.position,
      positionAbsolute: {
        x: (node.positionAbsolute?.x || 0) + n.delta.x,
        y: (node.positionAbsolute?.y || 0) + n.delta.y,
      },
    };
  });

  return [nodeId ? extentedDragItems.find((n) => n.id === nodeId)! : extentedDragItems[0], extentedDragItems];
}
