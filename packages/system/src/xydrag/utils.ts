import { InternalNodeBase, NodeLookup } from '..';
import { type NodeDragItem, type XYPosition, NodeBase } from '../types';

export function wrapSelectionDragFunc(selectionFunc?: (event: MouseEvent, nodes: NodeBase[]) => void) {
  return (event: MouseEvent, _: NodeBase, nodes: NodeBase[]) => selectionFunc?.(event, nodes);
}

export function isParentSelected<NodeType extends NodeBase>(node: NodeType, nodeLookup: NodeLookup): boolean {
  if (!node.parentNode) {
    return false;
  }

  const parentNode = nodeLookup.get(node.parentNode);

  if (!parentNode) {
    return false;
  }

  if (parentNode.selected) {
    return true;
  }

  return isParentSelected(parentNode, nodeLookup);
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
export function getDragItems<NodeType extends InternalNodeBase>(
  nodesDraggable: boolean,
  mousePos: XYPosition,
  nodeLookup: NodeLookup<NodeType>,
  nodeId?: string
): NodeDragItem[] {
  const dragItems: NodeDragItem[] = [];

  for (const [id, node] of nodeLookup) {
    if (
      (node.selected || node.id === nodeId) &&
      (!node.parentNode || !isParentSelected(node, nodeLookup)) &&
      (node.draggable || (nodesDraggable && typeof node.draggable === 'undefined'))
    ) {
      const internalNode = nodeLookup.get(id)!;

      dragItems.push({
        id: internalNode.id,
        position: internalNode.position || { x: 0, y: 0 },
        distance: {
          x: mousePos.x - (internalNode.internals.positionAbsolute?.x ?? 0),
          y: mousePos.y - (internalNode.internals.positionAbsolute?.y ?? 0),
        },
        extent: internalNode.extent,
        parentNode: internalNode.parentNode,
        origin: internalNode.origin,
        expandParent: internalNode.expandParent,
        internals: {
          positionAbsolute: internalNode.internals.positionAbsolute || { x: 0, y: 0 },
          width: internalNode.internals.width || 0,
          height: internalNode.internals.height || 0,
        },
      });
    }
  }

  return dragItems;
}

// returns two params:
// 1. the dragged node (or the first of the list, if we are dragging a node selection)
// 2. array of selected nodes (for multi selections)
export function getEventHandlerParams<NodeType extends NodeBase>({
  nodeId,
  dragItems,
  nodeLookup,
}: {
  nodeId?: string;
  dragItems: NodeDragItem[];
  nodeLookup: Map<string, NodeType>;
}): [NodeType, NodeType[]] {
  const nodesFromDragItems: NodeType[] = dragItems.map((n) => {
    const node = nodeLookup.get(n.id)!;

    return {
      ...node,
      position: n.position,
    };
  });

  return [nodeId ? nodesFromDragItems.find((n) => n.id === nodeId)! : nodesFromDragItems[0], nodesFromDragItems];
}
