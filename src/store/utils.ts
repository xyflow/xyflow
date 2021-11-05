import { ElementId, Node, NodeInternals, NodeInternalsItem, XYPosition } from '../types';

type XYPosAndTreeLevel = XYPosition & { treeLevel: number };

function addPositions(a: XYPosAndTreeLevel, b: XYPosition): XYPosAndTreeLevel {
  return {
    x: (a.x ?? 0) + (b.x ?? 0),
    y: (a.y ?? 0) + (b.y ?? 0),
    treeLevel: a.treeLevel + 1,
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
    addPositions(result, parentNode.position || { x: 0, y: 0 })
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

    if (node.parentNode) {
      const parentNodeInternal = nextNodeInternals.get(node.parentNode);

      const positionAbsoluteAndTreeLevel = getAbsolutePosAndTreeLevel(node, nextNodeInternals, {
        ...node.position,
        treeLevel: node.zIndex || updatedInternals?.treeLevel || parentNodeInternal?.treeLevel || 0,
      });

      const { treeLevel, x, y } = positionAbsoluteAndTreeLevel;

      nextNodeInternals.set(node.parentNode!, { ...nextNodeInternals.get(node.parentNode!), isParentNode: true });
      updatedInternals.positionAbsolute = {
        x,
        y,
      };
      updatedInternals.treeLevel = treeLevel;
    }

    // if (node.isDragging || node.isSelected) {
    //   nextNodeInternals.set(node.id, { ...updatedInternals, treeLevel: 1000 });
    // } else {
    //   nextNodeInternals.set(node.id, { ...updatedInternals, treeLevel: updatedInternals?.treeLevel || 0 });
    // }
  });

  return nextNodeInternals;
}
