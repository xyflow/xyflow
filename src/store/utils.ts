import { Node, Edge, NodeInternals, NodeInternalsItem, XYZPosition } from '../types';

type ParentNodes = Record<string, boolean>;

function calculateXYZPosition(
  node: NodeInternalsItem,
  nodeInternals: NodeInternals,
  parentNodes: ParentNodes,
  result: XYZPosition
): XYZPosition {
  if (!node.parentNode) {
    return result;
  }
  const parentNode = nodeInternals.get(node.parentNode)!;

  // +1 for each recursion level
  let zAddition = 1;

  // +2 if it's a parent node, so that groups/parents are always on top
  if (parentNodes[node.parentNode!]) {
    zAddition = 2;
  }

  if (parentNode.z) {
    zAddition += parentNode.z;
  }

  return calculateXYZPosition(parentNode, nodeInternals, parentNodes, {
    x: (result.x ?? 0) + (parentNode.position?.x ?? 0),
    y: (result.y ?? 0) + (parentNode.position?.y ?? 0),
    z: (result.z ?? 0) + zAddition,
  });
}
export function createNodeInternals(nodes: Node[], nodeInternals: NodeInternals): NodeInternals {
  const nextNodeInternals = new Map<string, NodeInternalsItem>();
  const parentNodes: ParentNodes = {};

  nodes.forEach((node) => {
    const z = node.zIndex ? node.zIndex : node.dragging || node.selected ? 1000 : 0;
    const internals: NodeInternalsItem = {
      ...nodeInternals.get(node.id),
      ...node,
      positionAbsolute: {
        x: node.position.x,
        y: node.position.y,
      },
      z,
    };
    if (node.parentNode) {
      internals.parentNode = node.parentNode;
      parentNodes[node.parentNode] = true;
    }
    nextNodeInternals.set(node.id, internals);
  });

  nodes.forEach((node) => {
    const updatedInternals: NodeInternalsItem = nextNodeInternals.get(node.id)!;

    if (node.parentNode && !nextNodeInternals.has(node.parentNode)) {
      throw new Error(`Parent node ${node.parentNode} not found`);
    }

    if (node.parentNode || parentNodes[node.id]) {
      let startingZ = updatedInternals.z || 0;

      if (!startingZ) {
        if (parentNodes[node.id]) {
          startingZ = 2;
        } else if (node.parentNode) {
          startingZ = 1;
        }
      }

      const { x, y, z } = calculateXYZPosition(node, nextNodeInternals, parentNodes, {
        ...node.position,
        z: startingZ,
      });

      updatedInternals.positionAbsolute = {
        x,
        y,
      };
      updatedInternals.z = z;

      if (parentNodes[node.id]) {
        updatedInternals.isParent = true;
      }
    }
  });

  return nextNodeInternals;
}

export const createNodeOrEdgeSelectionChange = (selected: boolean) => (item: Node | Edge) => ({
  id: item.id,
  type: 'select',
  selected,
});
