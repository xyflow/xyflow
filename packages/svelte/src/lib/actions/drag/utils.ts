import type {
  CoordinateExtent,
  Node,
  NodeDragItem,
  NodeInternals,
  NodeOrigin,
  XYPosition
} from '@reactflow/system';

import { clampPosition, isNumeric } from '../../../utils';

export function isParentSelected(node: Node, nodes: Node[]): boolean {
  if (!node.parentNode) {
    return false;
  }

  const parentNode = nodes.find((n) => n.id === node.parentNode);

  if (!parentNode) {
    return false;
  }

  if (parentNode.selected) {
    return true;
  }

  return isParentSelected(parentNode, nodes);
}

export function hasSelector(target: Element, selector: string, domNode: Element): boolean {
  let current = target;

  do {
    if (current?.matches(selector)) return true;
    if (current === domNode) return false;
    current = current.parentElement as Element;
  } while (current);

  return false;
}

// looks for all selected nodes and created a NodeDragItem for each of them
export function getDragItems(nodes: Node[], mousePos: XYPosition, nodeId?: string): NodeDragItem[] {
  return nodes
    .filter(
      (n) => (n.selected || n.id === nodeId) && (!n.parentNode || !isParentSelected(n, nodes))
    )
    .map((n) => ({
      id: n.id,
      position: n.position ? { ...n.position } : { x: 0, y: 0 },
      positionAbsolute: n.positionAbsolute ? { ...n.positionAbsolute } : { x: 0, y: 0 },
      distance: {
        x: mousePos.x - (n.positionAbsolute?.x ?? 0),
        y: mousePos.y - (n.positionAbsolute?.y ?? 0)
      },
      delta: {
        x: 0,
        y: 0
      },
      extent: n.extent,
      parentNode: n.parentNode,
      width: n.width,
      height: n.height
    }));
}

export function calcNextPosition(
  node: NodeDragItem | Node,
  nextPosition: XYPosition,
  nodes: Node[],
  nodeExtent?: CoordinateExtent,
  nodeOrigin: NodeOrigin = [0, 0]
): { position: XYPosition; positionAbsolute: XYPosition } {
  let currentExtent = node.extent || nodeExtent;

  if (node.extent === 'parent') {
    if (node.parentNode && node.width && node.height) {
      const parent = nodes.find((n) => n.id === node.parentNode)!;
      const { x: parentX, y: parentY } = parent.positionAbsolute!;
      currentExtent =
        parent &&
        isNumeric(parentX) &&
        isNumeric(parentY) &&
        isNumeric(parent.width) &&
        isNumeric(parent.height)
          ? [
              [parentX + node.width * nodeOrigin[0], parentY + node.height * nodeOrigin[1]],
              [
                parentX + parent.width! - node.width + node.width * nodeOrigin[0],
                parentY + parent.height! - node.height + node.height * nodeOrigin[1]
              ]
            ]
          : currentExtent;
    } else {
      currentExtent = nodeExtent;
    }
  } else if (node.extent && node.parentNode) {
    const parent = nodes.find((n) => n.id === node.parentNode)!;
    const { x: parentX, y: parentY } = parent.positionAbsolute!;
    currentExtent = [
      [node.extent[0][0] + parentX, node.extent[0][1] + parentY],
      [node.extent[1][0] + parentX, node.extent[1][1] + parentY]
    ];
  }

  let parentPosition = { x: 0, y: 0 };

  if (node.parentNode) {
    const parent = nodes.find((n) => n.id === node.parentNode)!;
    parentPosition = parent.positionAbsolute!;
  }

  const positionAbsolute = currentExtent
    ? clampPosition(nextPosition, currentExtent as CoordinateExtent)
    : nextPosition;

  return {
    position: {
      x: positionAbsolute.x - parentPosition.x,
      y: positionAbsolute.y - parentPosition.y
    },
    positionAbsolute
  };
}

// returns two params:
// 1. the dragged node (or the first of the list, if we are dragging a node selection)
// 2. array of selected nodes (for multi selections)
export function getEventHandlerParams({
  nodeId,
  dragItems,
  nodeInternals
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
      positionAbsolute: n.positionAbsolute
    };
  });

  return [
    nodeId ? extentedDragItems.find((n) => n.id === nodeId)! : extentedDragItems[0],
    extentedDragItems
  ];
}
