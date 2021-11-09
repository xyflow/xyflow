import { ElementId, Node, NodeInternals, NodeInternalsItem, XYPosition } from '../types';

type XYZPosition = XYPosition & { z: number };
type ParentNodes = Record<ElementId, boolean>;

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
  const nextNodeInternals = new Map<ElementId, NodeInternalsItem>();
  const parentNodes: ParentNodes = {};

  nodes.forEach((node) => {
    const internals: NodeInternalsItem = {
      ...nodeInternals.get(node.id),
      id: node.id,
      width: node.width || null,
      height: node.height || null,
      position: node.position,
      positionAbsolute: node.position,
      z: node.isDragging || node.isSelected ? 1000 : node.zIndex || 0,
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
      let startingZ = updatedInternals.z;

      if (!startingZ) {
        if (parentNodes[node.id] && node.parentNode) {
          startingZ = 2;
        } else if (node.parentNode) {
          startingZ = 1;
        }
      }

      const { x, y, z } = calculateXYZPosition(node, nextNodeInternals, parentNodes, {
        ...node.position,
        z: startingZ as number,
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
