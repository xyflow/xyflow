import { type NodeDragItem, type XYPosition, NodeBase } from '../types';

export function wrapSelectionDragFunc(selectionFunc?: (event: MouseEvent, nodes: NodeBase[]) => void) {
  return (event: MouseEvent, _: NodeBase, nodes: NodeBase[]) => selectionFunc?.(event, nodes);
}

export function isParentSelected<NodeType extends NodeBase>(node: NodeType, nodes: NodeType[]): boolean {
  if (!node.parentNode) {
    return false;
  }

  const parentNode = nodes.find((node) => node.id === node.parentNode);

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
export function getDragItems<NodeType extends NodeBase>(
  nodes: NodeType[],
  nodesDraggable: boolean,
  mousePos: XYPosition,
  nodeId?: string
): NodeDragItem[] {
  return nodes
    .filter(
      (n) =>
        (n.selected || n.id === nodeId) &&
        (!n.parentNode || !isParentSelected(n, nodes)) &&
        (n.draggable || (nodesDraggable && typeof n.draggable === 'undefined'))
    )
    .map((n) => ({
      id: n.id,
      position: n.position || { x: 0, y: 0 },
      distance: {
        x: mousePos.x - (n.computed?.positionAbsolute?.x ?? 0),
        y: mousePos.y - (n.computed?.positionAbsolute?.y ?? 0),
      },
      delta: {
        x: 0,
        y: 0,
      },
      extent: n.extent,
      parentNode: n.parentNode,
      origin: n.origin,
      expandParent: n.expandParent,
      computed: {
        positionAbsolute: n.computed?.positionAbsolute || { x: 0, y: 0 },
        width: n.computed?.width || 0,
        height: n.computed?.height || 0,
      },
    }));
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
      computed: {
        ...n.computed,
        positionAbsolute: n.computed.positionAbsolute,
      },
    };
  });

  return [nodeId ? nodesFromDragItems.find((n) => n.id === nodeId)! : nodesFromDragItems[0], nodesFromDragItems];
}
