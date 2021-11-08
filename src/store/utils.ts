import { ElementId, Node, NodeInternals, NodeInternalsItem, XYPosition } from '../types';

type XYPosAndTreeLevel = XYPosition & { treeLevel: number };

function addPositions(a: XYPosAndTreeLevel, b: XYPosAndTreeLevel): XYPosAndTreeLevel {
  return {
    x: (a.x ?? 0) + (b.x ?? 0),
    y: (a.y ?? 0) + (b.y ?? 0),
    treeLevel: a.treeLevel + (b.treeLevel || 1),
  };
}

function getAbsolutePosAndTreeLevel(
  node: NodeInternalsItem,
  nodeInternals: NodeInternals,
  result: XYPosAndTreeLevel
): XYPosAndTreeLevel {
  const parentNode = node.parentNode ? nodeInternals.get(node.parentNode) : false;

  if (!parentNode) {
    return result;
  }

  return getAbsolutePosAndTreeLevel(
    parentNode,
    nodeInternals,
    addPositions(result, {
      x: parentNode.position?.x || 0,
      y: parentNode.position?.y || 0,
      treeLevel: parentNode.treeLevel || 0,
    })
  );
}
export function createNodeInternals(nodes: Node[], nodeInternals: NodeInternals): NodeInternals {
  const nextNodeInternals = new Map<ElementId, NodeInternalsItem>();
  const parentNodes: Record<ElementId, boolean> = {};

  nodes.forEach((node) => {
    const internals: NodeInternalsItem = {
      ...nodeInternals.get(node.id),
      width: node.width || null,
      height: node.height || null,
      position: node.position,
      positionAbsolute: node.position,
      treeLevel: node.isDragging || node.isSelected ? 1000 : node.zIndex || 0,
    };
    if (node.parentNode) {
      internals.parentNode = node.parentNode;
      parentNodes[node.parentNode] = true;
    }
    nextNodeInternals.set(node.id, internals);
  });

  nodes.forEach((node) => {
    const updatedInternals: NodeInternalsItem = nextNodeInternals.get(node.id)!;

    if (node.parentNode || parentNodes[node.id]) {
      if (node.parentNode) {
        const parentNodeInternal = nextNodeInternals.get(node.parentNode);
        if (parentNodeInternal) {
          parentNodeInternal.isParentNode = true;
        }
      }

      const positionAbsoluteAndTreeLevel = getAbsolutePosAndTreeLevel(node, nextNodeInternals, {
        ...node.position,
        treeLevel: updatedInternals.treeLevel || 1,
      });

      const { treeLevel, x, y } = positionAbsoluteAndTreeLevel;

      updatedInternals.positionAbsolute = {
        x,
        y,
      };
      updatedInternals.treeLevel = treeLevel;
    }
  });

  return nextNodeInternals;
}
